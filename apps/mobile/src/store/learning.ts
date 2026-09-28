import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProgressItem, ProgressItemType, ProgressStatus } from "@abugikha/contracts";
import { DEFAULT_LOCALE, type Locale } from "@abugikha/core";

export const progressKey = (type: ProgressItemType, id: string) => `${type}:${id}`;

interface LearningState {
  locale: Locale;
  showPhonetic: boolean;
  displayName: string | null;
  /** Tiến độ cục bộ (nguồn sự thật khi offline), khoá theo progressKey */
  progress: Record<string, ProgressItem>;
  /** Các khoá đã sửa nhưng chưa đẩy lên server */
  dirty: string[];
  /** serverTime của lần đồng bộ thành công gần nhất */
  lastSyncAt: string | null;
  /** Thời điểm tuỳ chỉnh đổi phía máy; null = chưa đổi từ lần đồng bộ trước */
  prefsChangedAt: string | null;

  setLocale: (l: Locale) => void;
  setShowPhonetic: (v: boolean) => void;
  setDisplayName: (v: string | null) => void;
  setStatus: (type: ProgressItemType, id: string, status: ProgressStatus | null) => void;
  /** Gộp dữ liệu server: bản nào updatedAt mới hơn thì thắng */
  /** `pushed`: ảnh chụp các bản đã đẩy lên, để biết bản nào bị sửa tiếp trong lúc đồng bộ */
  mergeRemote: (items: ProgressItem[], serverTime: string, pushed: Record<string, ProgressItem>) => void;
  markPrefsSynced: (changedAt: string | null) => void;
}

export const useLearning = create<LearningState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      showPhonetic: true,
      displayName: null,
      progress: {},
      dirty: [],
      lastSyncAt: null,
      prefsChangedAt: null,

      setLocale: (locale) => set({ locale, prefsChangedAt: new Date().toISOString() }),
      setShowPhonetic: (showPhonetic) => set({ showPhonetic, prefsChangedAt: new Date().toISOString() }),
      setDisplayName: (displayName) => set({ displayName }),
      setStatus: (itemType, itemId, status) =>
        set((s) => {
          const key = progressKey(itemType, itemId);
          const now = new Date().toISOString();
          const prev = s.progress[key];
          const next: ProgressItem = {
            itemType,
            itemId,
            // Bỏ đánh dấu = lùi về "seen" để vẫn đồng bộ được (không xoá cứng)
            status: status ?? "seen",
            correct: prev?.correct ?? 0,
            attempts: prev?.attempts ?? 0,
            lastReviewedAt: now,
            updatedAt: now,
          };
          return {
            progress: { ...s.progress, [key]: next },
            dirty: s.dirty.includes(key) ? s.dirty : [...s.dirty, key],
          };
        }),
      mergeRemote: (items, serverTime, pushed) =>
        set((s) => {
          const progress = { ...s.progress };
          for (const item of items) {
            const key = progressKey(item.itemType, item.itemId);
            const local = progress[key];
            if (!local || Date.parse(item.updatedAt) >= Date.parse(local.updatedAt)) progress[key] = item;
          }
          // Chỉ bỏ cờ dirty cho bản đã đẩy và chưa bị sửa tiếp trong lúc đồng bộ
          const dirty = s.dirty.filter((k) => !(k in pushed) || s.progress[k] !== pushed[k]);
          return { progress, dirty, lastSyncAt: serverTime };
        }),
      markPrefsSynced: (changedAt) => set((s) => (s.prefsChangedAt === changedAt ? { prefsChangedAt: null } : {})),
    }),
    {
      name: "abugikha-learning",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
