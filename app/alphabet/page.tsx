import type { Metadata } from "next";
import { AlphabetPage } from "@/pages/alphabet";

export const metadata: Metadata = {
  title: "Alphabet / Thai Abugida – Abugikha",
};

export default function Page() {
  return <AlphabetPage />;
}
