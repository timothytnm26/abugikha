import { StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { CLASS_META, CONSONANT_BY_ID, consonantSpeech } from "@abugikha/core/consonant";
import { ipaToRtgs } from "@abugikha/core";
import { useL, useT } from "@/lib/i18n";
import { speakThai } from "@/lib/speech";
import { syncNow } from "@/lib/sync";
import { useColors } from "@/lib/theme";
import { progressKey, useLearning } from "@/store/learning";
import { Button, Card, Screen } from "@/ui/screen";

export default function ConsonantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const l = useL();
  const c = useColors();
  const item = CONSONANT_BY_ID.get(id);
  const status = useLearning((s) => s.progress[progressKey("consonant", id)]?.status);
  const setStatus = useLearning((s) => s.setStatus);
  const showPhonetic = useLearning((s) => s.showPhonetic);
  if (!item) return null;

  const color = c.accent(item.cls);
  const mastered = status === "mastered";
  const toggle = () => {
    setStatus("consonant", item.id, mastered ? "learning" : "mastered");
    void syncNow();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: item.name }} />
      <View style={styles.hero}>
        <Text style={[styles.glyph, { color }]}>{item.char}</Text>
        <Text style={{ color, fontWeight: "600" }}>
          {t.syllable.group(l(CLASS_META[item.cls].label))} · {CLASS_META[item.cls].thai}
        </Text>
      </View>
      <Card>
        <Row label={t.alphabet.keyword} value={`${item.word} · ${l(item.meaning)}`} />
        <Row label={t.alphabet.initial} value={showPhonetic ? `/${item.initial}/ · ${ipaToRtgs(item.initial)}` : item.char} />
        <Row label={t.alphabet.final} value={item.final ? (showPhonetic ? `/${item.final}/` : "✓") : t.alphabet.noFinal} />
      </Card>
      <View style={styles.actions}>
        <Button label={`▶ ${t.alphabet.listenName}`} onPress={() => speakThai(consonantSpeech(item))} />
        <Button label={mastered ? t.app.unmarkLearned : t.app.markLearned} onPress={toggle} color={color} />
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const c = useColors();
  return (
    <View style={styles.row}>
      <Text style={{ color: c.inkSoft }}>{label}</Text>
      <Text style={{ color: c.ink, fontWeight: "500", flexShrink: 1, textAlign: "right" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: 4, paddingVertical: 16 },
  glyph: { fontSize: 120, lineHeight: 150 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
