import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { DICTS, LOCALES, type Locale } from "@abugikha/i18n";
import { fmt, useT } from "@/lib/i18n";
import { api, ensureSession } from "@/lib/session";
import { syncNow, useSyncStatus } from "@/lib/sync";
import { useColors } from "@/lib/theme";
import { useLearning } from "@/store/learning";
import { ChipRow } from "@/ui/chips";
import { Button, Card, Screen, SectionTitle } from "@/ui/screen";

export default function ProfileScreen() {
  const t = useT();
  const c = useColors();
  const { locale, showPhonetic, displayName, progress, lastSyncAt, setLocale, setShowPhonetic, setDisplayName } = useLearning();
  const status = useSyncStatus((s) => s.status);
  const [name, setName] = useState(displayName ?? "");
  useEffect(() => setName(displayName ?? ""), [displayName]);

  const counts = Object.values(progress).reduce<Record<string, number>>((acc, p) => {
    if (p.status === "mastered") acc[p.itemType] = (acc[p.itemType] ?? 0) + 1;
    return acc;
  }, {});

  const saveName = async () => {
    const value = name.trim() || null;
    setDisplayName(value);
    try {
      await ensureSession(locale);
      await api.me.update({ displayName: value });
    } catch {
      // Lưu cục bộ trước; lần sau có mạng người dùng lưu lại
    }
  };

  const syncLabel =
    status === "syncing"
      ? t.app.profile.syncing
      : status === "offline"
        ? t.app.profile.offline
        : lastSyncAt
          ? fmt(t.app.profile.synced, { time: new Date(lastSyncAt).toLocaleTimeString(locale) })
          : t.app.profile.neverSynced;

  return (
    <Screen>
      <SectionTitle>{t.app.profile.displayName}</SectionTitle>
      <Card>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.app.profile.displayNamePlaceholder}
          placeholderTextColor={c.inkSoft}
          maxLength={40}
          style={[styles.input, { color: c.ink, borderColor: c.inkSoft }]}
        />
        <Button label={t.app.profile.save} onPress={saveName} />
        <Text style={{ color: c.inkSoft, fontSize: 12 }}>{t.app.profile.anonymousNote}</Text>
      </Card>

      <SectionTitle>{t.app.profile.language}</SectionTitle>
      <ChipRow
        value={locale}
        onChange={(l) => {
          setLocale(l as Locale);
          void syncNow();
        }}
        options={LOCALES.map((id) => ({ id, label: DICTS[id].meta.languageName }))}
      />

      <Card>
        <View style={styles.row}>
          <Text style={{ color: c.ink }}>{t.app.profile.showPhonetic}</Text>
          <Switch
            value={showPhonetic}
            onValueChange={(v) => {
              setShowPhonetic(v);
              void syncNow();
            }}
          />
        </View>
      </Card>

      <SectionTitle>{t.app.profile.progress}</SectionTitle>
      <Card>
        <Text style={{ color: c.ink }}>
          {t.aksornthai.consonants}: {counts.consonant ?? 0}
        </Text>
      </Card>

      <SectionTitle>{t.app.profile.sync}</SectionTitle>
      <Card>
        <Text style={{ color: c.inkSoft }}>{syncLabel}</Text>
        <Button label={t.app.profile.syncNow} onPress={() => void syncNow()} disabled={status === "syncing"} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
