import type { Metadata } from "next";
import { BuilderPage } from "@/pages/builder";
import { pageMetadata } from "@/shared/config/metadata";
import { resolveLocale, type LocaleParams } from "@/shared/config/locale-params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "/lab", "lab");
}

export default BuilderPage;
