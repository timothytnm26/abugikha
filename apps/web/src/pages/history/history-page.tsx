"use client";
import { ScriptHistoryGraph } from "@/widgets/script-history-graph";
import { useT } from "@/shared/i18n";
import { PageIntro } from "@/shared/ui";

export function HistoryPage() {
  const t = useT();
  return (
    <>
      <PageIntro title={t.history.title}>{t.history.intro}</PageIntro>
      <ScriptHistoryGraph />
    </>
  );
}
