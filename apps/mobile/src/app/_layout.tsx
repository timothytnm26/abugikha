import { useEffect } from "react";
import { AppState } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { syncNow } from "@/lib/sync";
import { useColors } from "@/lib/theme";
import { useLearning } from "@/store/learning";

export default function RootLayout() {
  const c = useColors();

  // Đồng bộ khi đã nạp dữ liệu cục bộ và mỗi lần app quay lại foreground
  useEffect(() => {
    const start = () => void syncNow();
    const unsub = useLearning.persist.hasHydrated() ? (start(), () => {}) : useLearning.persist.onFinishHydration(start);
    const sub = AppState.addEventListener("change", (s) => s === "active" && start());
    return () => {
      unsub();
      sub.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style={c.theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.paper },
          headerTintColor: c.ink,
          contentStyle: { backgroundColor: c.paper },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="consonant/[id]" options={{ presentation: "modal", title: "" }} />
      </Stack>
    </>
  );
}
