import { Text, type ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { useT } from "@/lib/i18n";
import { useColors } from "@/lib/theme";

const icon = (glyph: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ color, fontSize: 20 }}>{glyph}</Text>;
  };

export default function TabsLayout() {
  const t = useT();
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.paper },
        headerTintColor: c.ink,
        tabBarStyle: { backgroundColor: c.paper },
        tabBarActiveTintColor: c.ink,
        tabBarInactiveTintColor: c.inkSoft,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.app.tabs.learn, tabBarIcon: icon("ก") }} />
      <Tabs.Screen name="builder" options={{ title: t.app.tabs.builder, tabBarIcon: icon("ก้") }} />
      <Tabs.Screen name="profile" options={{ title: t.app.tabs.profile, tabBarIcon: icon("☺") }} />
    </Tabs>
  );
}
