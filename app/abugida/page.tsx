import type { Metadata } from "next";
import { AlphabetPage } from "@/pages/alphabet";

export const metadata: Metadata = {
  title: "Abugida tiếng Thái / Thai Abugida – NarakThai",
};

export default function Page() {
  return <AlphabetPage />;
}
