import type { Metadata } from "next";
import { HistoryPage } from "@/pages/history";
import { pageMetadata } from "@/shared/config/metadata";
import { resolveLocale, type LocaleParams } from "@/shared/config/locale-params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "/history", "history");
}

export default HistoryPage;
