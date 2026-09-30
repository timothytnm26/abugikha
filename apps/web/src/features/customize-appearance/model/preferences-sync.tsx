"use client";
import { useEffect, useState } from "react";
import { applyAppearance, usePreferences } from "@/shared/lib/preferences";

/** Nạp tuỳ chỉnh đã lưu và giữ <html> khớp với giao diện, màu, kiểu giấy đang chọn. */
export function PreferencesSync() {
  const themeId = usePreferences((s) => s.themeId);
  const palette = usePreferences((s) => s.palette);
  const paper = usePreferences((s) => s.paper);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.resolve(usePreferences.persist.rehydrate()).then(() => setReady(true));
  }, []);
  useEffect(() => {
    // Chờ nạp xong, nếu không sẽ xoá màu mà script đầu trang vừa áp
    if (!ready) return;
    applyAppearance(themeId, themeId ? palette[themeId] : undefined, paper);
    if (themeId) return;
    // Chưa chọn giao diện nào: đi theo chế độ sáng/tối của hệ thống
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => applyAppearance(null, undefined, paper);
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, [ready, themeId, palette, paper]);
  return null;
}
