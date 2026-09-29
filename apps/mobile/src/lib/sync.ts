import { create } from "zustand";
import { PROGRESS_BATCH_MAX, type ProgressItem } from "@abugikha/contracts";
import { ApiClientError } from "@abugikha/contracts/client";
import { useLearning } from "@/store/learning";
import { api, clearSession, ensureSession } from "./session";

type SyncStatus = "idle" | "syncing" | "offline";
export const useSyncStatus = create<{ status: SyncStatus }>(() => ({ status: "idle" }));

let running: Promise<void> | null = null;

/**
 * Đồng bộ offline-first: đẩy các bản đã sửa → đồng bộ tuỳ chỉnh → kéo thay đổi từ lần trước.
 * Gọi nhiều lần cùng lúc chỉ chạy một lượt. Lỗi mạng không làm mất dữ liệu cục bộ.
 */
export function syncNow(): Promise<void> {
  running ??= run().finally(() => {
    running = null;
  });
  return running;
}

async function run() {
  useSyncStatus.setState({ status: "syncing" });
  try {
    const s = useLearning.getState();
    await ensureSession(s.locale);

    const pushed: Record<string, ProgressItem> = {};
    for (const key of s.dirty) if (s.progress[key]) pushed[key] = s.progress[key];
    const items = Object.values(pushed);
    for (let i = 0; i < items.length; i += PROGRESS_BATCH_MAX) {
      await api.progress.upsert(items.slice(i, i + PROGRESS_BATCH_MAX));
    }

    const remote = await api.preferences.get();
    if (s.prefsChangedAt) {
      await Promise.all([
        api.preferences.put({ ...remote.preferences, showPhonetic: s.showPhonetic }),
        api.me.update({ locale: s.locale }),
      ]);
      useLearning.getState().markPrefsSynced(s.prefsChangedAt);
    } else if (remote.updatedAt) {
      useLearning.setState({ showPhonetic: remote.preferences.showPhonetic });
    }

    const list = await api.progress.list({ since: s.lastSyncAt ?? undefined });
    useLearning.getState().mergeRemote(list.items, list.serverTime, pushed);
    useSyncStatus.setState({ status: "idle" });
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 401) await clearSession();
    else if (!(e instanceof TypeError)) console.warn("sync failed", e);
    useSyncStatus.setState({ status: "offline" });
  }
}
