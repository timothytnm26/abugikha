"use client";
import { create } from "zustand";
import type { ToneMarkId } from "@/entities/syllable";

export type PartKind = "initial" | "vowel" | "final" | "mark";

interface BuilderState {
  initialId: string;
  vowelId: string;
  finalId: string | null;
  mark: ToneMarkId | null;
  tab: PartKind;
  /** Tăng mỗi lần đổi mảnh → kích hoạt hiệu ứng hợp nhất */
  pulse: number;
  lastKind: PartKind | null;
  setPart: (kind: PartKind, id: string | null) => void;
  /** Đặt cả âm tiết một lần (ví dụ mẫu), chỉ một lần hợp nhất */
  setSyllable: (s: { initialId: string; vowelId: string; finalId: string | null; mark: ToneMarkId | null }) => void;
  setTab: (tab: PartKind) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  initialId: "หน",
  vowelId: "aa",
  finalId: null,
  mark: "tho",
  tab: "initial",
  pulse: 0,
  lastKind: null,
  setPart: (kind, id) =>
    set((s) => {
      const patch: Partial<BuilderState> = { pulse: s.pulse + 1, lastKind: kind };
      if (kind === "initial" && id) patch.initialId = id;
      if (kind === "vowel" && id) patch.vowelId = id;
      if (kind === "final") patch.finalId = id;
      if (kind === "mark") patch.mark = id as ToneMarkId | null;
      return patch;
    }),
  setSyllable: (s) => set((st) => ({ ...s, pulse: st.pulse + 1, lastKind: "initial" })),
  setTab: (tab) => set({ tab }),
}));
