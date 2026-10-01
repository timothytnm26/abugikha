"use client";
import { AksornThaiBoard } from "@/widgets/aksornthai-board";
import { ClassLegend } from "@/entities/consonant";
import { useT } from "@/shared/i18n";
import { PageIntro } from "@/shared/ui";

export function AksornThaiPage() {
  const t = useT();
  return (
    <>
      <PageIntro title={t.aksornthai.title}>{t.aksornthai.intro}</PageIntro>
      <div className="page-container py-6 md:py-8">
        <ClassLegend className="mb-4" />
        <AksornThaiBoard />
      </div>
    </>
  );
}
