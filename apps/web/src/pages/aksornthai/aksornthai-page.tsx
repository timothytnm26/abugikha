"use client";
import { AksornThaiBoard } from "@/widgets/aksornthai-board";
import { useT } from "@/shared/i18n";
import { PageIntro } from "@/shared/ui";

export function AksornThaiPage() {
  const t = useT();
  return (
    <>
      <PageIntro title={t.aksornthai.title} compact>{t.aksornthai.intro}</PageIntro>
      <AksornThaiBoard />
    </>
  );
}
