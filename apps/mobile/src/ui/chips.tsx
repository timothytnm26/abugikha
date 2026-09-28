import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useColors } from "@/lib/theme";

export interface ChipOption {
  id: string;
  label: string;
  color?: string;
}

/** Hàng chọn một giá trị, cuộn ngang. */
export function ChipRow({ options, value, onChange }: { options: ChipOption[]; value: string; onChange: (id: string) => void }) {
  const c = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((o) => {
        const on = o.id === value;
        const color = o.color ?? c.ink;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.id)}
            style={[styles.chip, { borderColor: color }, on && { backgroundColor: color }]}
          >
            <Text style={[styles.label, { color: on ? c.paper : color }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: { minWidth: 48, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" },
  label: { fontSize: 22 },
});
