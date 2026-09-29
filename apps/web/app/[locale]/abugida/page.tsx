import type { Metadata } from "next";
import { AlphabetPage } from "@/pages/alphabet";
import { pageMetadata } from "@/shared/config/metadata";
import { resolveLocale, type LocaleParams } from "@/shared/config/locale-params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "/abugida", "aksornthai");
}

export default AlphabetPage;
