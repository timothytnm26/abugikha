import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/lib/theme";

export function Screen({ children }: { children: ReactNode }) {
  const c = useColors();
  return (
    <ScrollView style={{ backgroundColor: c.paper }} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const c = useColors();
  return <Text style={[styles.section, { color: c.inkSoft }]}>{children}</Text>;
}

export function Card({ children }: { children: ReactNode }) {
  const c = useColors();
  return <View style={[styles.card, { backgroundColor: c.paperDeep }]}>{children}</View>;
}

export function Button({ label, onPress, color, disabled }: { label: string; onPress: () => void; color?: string; disabled?: boolean }) {
  const c = useColors();
  return (
    <Text
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      style={[styles.button, { backgroundColor: color ?? c.ink, color: c.paper, opacity: disabled ? 0.5 : 1 }]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  section: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 8 },
  card: { borderRadius: 16, padding: 16, gap: 8 },
  button: {
    alignSelf: "flex-start",
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontWeight: "600",
  },
});
