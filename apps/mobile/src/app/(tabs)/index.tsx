import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { CLASS_META, CONSONANTS } from "@abugikha/core/consonant";
import { useL, useT } from "@/lib/i18n";
import { useColors } from "@/lib/theme";
import { progressKey, useLearning } from "@/store/learning";
import { Screen, SectionTitle } from "@/ui/screen";

const LETTERS = CONSONANTS.filter((x) => !x.obsolete);

export default function AlphabetScreen() {
  const t = useT();
  const l = useL();
  const c = useColors();
  const progress = useLearning((s) => s.progress);
  const learned = LETTERS.filter((x) => progress[progressKey("consonant", x.id)]?.status === "mastered").length;

  return (
    <Screen>
      <Text style={[styles.count, { color: c.ink }]}>{t.app.learned(learned, LETTERS.length)}</Text>
      <View style={styles.legend}>
        {(["mid", "high", "low"] as const).map((cls) => (
          <Text key={cls} style={{ color: c.accent(cls), fontWeight: "600" }}>
            ● {l(CLASS_META[cls].label)}
          </Text>
        ))}
      </View>
      <SectionTitle>{t.alphabet.consonants}</SectionTitle>
      <View style={styles.grid}>
        {LETTERS.map((x) => {
          const done = progress[progressKey("consonant", x.id)]?.status === "mastered";
          const color = c.accent(x.cls);
          return (
            <Pressable
              key={x.id}
              accessibilityLabel={`${x.char} ${x.name}`}
              onPress={() => router.push({ pathname: "/consonant/[id]", params: { id: x.id } })}
              style={[styles.cell, done ? { backgroundColor: color } : { borderColor: color, opacity: x.common ? 1 : 0.6 }]}
            >
              <Text style={[styles.glyph, { color: done ? c.onAccent : color }]}>{x.char}</Text>
              <Text style={[styles.name, { color: done ? c.onAccent : c.inkSoft }]} numberOfLines={1}>
                {x.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 18, fontWeight: "600" },
  legend: { flexDirection: "row", gap: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cell: { width: 72, height: 80, borderRadius: 14, borderWidth: 1.5, borderColor: "transparent", alignItems: "center", justifyContent: "center" },
  glyph: { fontSize: 34 },
  name: { fontSize: 10 },
});
