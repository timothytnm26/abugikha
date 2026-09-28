import type { Metadata } from "next";
import { HomePage } from "@/pages/home";
import { pageMetadata } from "@/shared/config/metadata";
import { resolveLocale, type LocaleParams } from "@/shared/config/locale-params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "/");
}

export default HomePage;
