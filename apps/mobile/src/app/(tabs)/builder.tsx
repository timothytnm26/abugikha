import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CONSONANTS, CONSONANT_BY_ID, INITIAL_BY_ID, INITIAL_UNITS } from "@abugikha/core/consonant";
import { VOWELS, VOWEL_BY_ID, vowelFitsInitial, vowelGlyph } from "@abugikha/core/vowel";
import { TONE_MARKS, TONE_META, analyzeSyllable, type ToneMarkId } from "@abugikha/core/syllable";
import { ipaToRtgs } from "@abugikha/core";
import { useL, useLocale, useT } from "@/lib/i18n";
import { speakThai } from "@/lib/speech";
import { useColors } from "@/lib/theme";
import { progressKey, useLearning } from "@/store/learning";
import { ChipRow } from "@/ui/chips";
import { Button, Card, Screen, SectionTitle } from "@/ui/screen";

const NONE = "-";
const INITIALS = INITIAL_UNITS.filter((u) => u.common);
const FINALS = CONSONANTS.filter((x) => x.final && x.common && !x.obsolete);

export default function BuilderScreen() {
  const t = useT();
  const l = useL();
  const locale = useLocale();
  const c = useColors();
  const showPhonetic = useLearning((s) => s.showPhonetic);
  const setStatus = useLearning((s) => s.setStatus);
  const [initialId, setInitial] = useState("หน");
  const [vowelId, setVowel] = useState("aa");
  const [finalId, setFinal] = useState(NONE);
  const [mark, setMark] = useState<string>("tho");

  const initial = INITIAL_BY_ID.get(initialId)!;
  const vowels = VOWELS.filter((v) => vowelFitsInitial(v, initial.chars));
  const vowel = VOWEL_BY_ID.get(vowelId) ?? vowels[0]!;
  const a = useMemo(
    () =>
      analyzeSyllable(
        {
          initial,
          vowel,
          final: finalId === NONE ? null : CONSONANT_BY_ID.get(finalId),
          mark: mark === NONE ? null : (mark as ToneMarkId),
        },
        locale,
      ),
    [initial, vowel, finalId, mark, locale],
  );
  const toneColor = c.tone(a.tone);

  const listen = () => {
    speakThai(a.spelling);
    const seen = useLearning.getState().progress[progressKey("syllable", a.spelling)];
    if (!seen) setStatus("syllable", a.spelling, "seen");
  };

  return (
    <Screen>
      <Card>
        <Text style={[styles.spelling, { color: toneColor }]}>{a.spelling}</Text>
        {showPhonetic && (
          <Text style={[styles.ipa, { color: c.ink }]}>
            /{a.ipa}/ · {ipaToRtgs(a.ipa)}
          </Text>
        )}
        <Text style={{ color: toneColor, fontWeight: "600" }}>
          {t.syllable.tone(l(TONE_META[a.tone].label), TONE_META[a.tone].thai)} · {a.liveness === "live" ? t.syllable.live : t.syllable.dead}
        </Text>
        <Button label={`▶ ${t.common.listen}`} onPress={listen} />
      </Card>

      <SectionTitle>{t.syllable.stepLabels.class}</SectionTitle>
      <ChipRow
        value={initialId}
        onChange={setInitial}
        options={INITIALS.map((u) => ({ id: u.id, label: u.chars, color: c.accent(u.cls) }))}
      />
      <SectionTitle>{t.syllable.stepLabels.vowel}</SectionTitle>
      <ChipRow value={vowel.id} onChange={setVowel} options={vowels.map((v) => ({ id: v.id, label: vowelGlyph(v) }))} />
      <SectionTitle>{t.syllable.stepLabels.final}</SectionTitle>
      <ChipRow
        value={finalId}
        onChange={setFinal}
        options={[{ id: NONE, label: t.common.none }, ...FINALS.map((f) => ({ id: f.id, label: f.char }))]}
      />
      <SectionTitle>{t.syllable.stepLabels.mark}</SectionTitle>
      <ChipRow
        value={mark}
        onChange={setMark}
        options={[{ id: NONE, label: t.common.none }, ...TONE_MARKS.map((m) => ({ id: m.id, label: `◌${m.char}` }))]}
      />

      <SectionTitle>{t.syllable.stepLabels.result}</SectionTitle>
      <Card>
        {a.steps.map((s, i) => (
          <View key={i} style={styles.step}>
            <Text style={{ color: s.accent ? c.accent(s.accent) : c.ink, fontWeight: "600" }}>{s.title}</Text>
            {!!s.detail && <Text style={{ color: c.inkSoft }}>{s.detail}</Text>}
          </View>
        ))}
        {a.warnings.map((w) => (
          <Text key={w} style={{ color: c.accent("high") }}>
            {w}
          </Text>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  spelling: { fontSize: 72, lineHeight: 110, textAlign: "center" },
  ipa: { fontSize: 18, textAlign: "center" },
  step: { gap: 2, paddingVertical: 4 },
});
