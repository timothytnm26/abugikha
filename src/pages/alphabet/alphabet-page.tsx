"use client";
import { AlphabetBoard } from "@/widgets/alphabet-board";
import { useT } from "@/shared/i18n";
import { PageIntro } from "@/shared/ui";

export function AlphabetPage() {
  const t = useT();
  return (
    <>
      <PageIntro title={t.alphabet.title} compact>{t.alphabet.intro}</PageIntro>
      <AlphabetBoard />
    </>
  );
}
