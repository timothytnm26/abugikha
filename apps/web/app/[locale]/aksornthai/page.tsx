import type { Metadata } from "next";
import { AksornThaiPage } from "@/pages/aksornthai";
import { pageMetadata } from "@/shared/config/metadata";
import { resolveLocale, type LocaleParams } from "@/shared/config/locale-params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "/aksornthai", "aksornthai");
}

export default AksornThaiPage;
