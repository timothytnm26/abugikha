"use client";
import { useEffect, useState } from "react";
import { applyAppearance, usePreferences } from "@/shared/lib/preferences";

/** Nạp tuỳ chỉnh đã lưu và giữ <html> khớp với skin, màu, kiểu giấy đang chọn. */
export function PreferencesSync() {
  const skinId = usePreferences((s) => s.skinId);
  const palette = usePreferences((s) => s.palette);
  const paper = usePreferences((s) => s.paper);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.resolve(usePreferences.persist.rehydrate()).then(() => setReady(true));
  }, []);
  useEffect(() => {
    // Chờ nạp xong, nếu không sẽ ghi đè màu mà script đầu trang vừa áp
    if (!ready) return;
    applyAppearance(skinId, palette[skinId], paper);
  }, [ready, skinId, palette, paper]);
  return null;
}
