import type { Metadata } from "next";
import { IpaPage } from "@/pages/ipa";
import { pageMetadata } from "@/shared/config/metadata";
import { resolveLocale, type LocaleParams } from "@/shared/config/locale-params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "/ipa", "ipa");
}

export default IpaPage;
