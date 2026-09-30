import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { consonantQueries } from "@/entities/consonant";
import { vowelQueries } from "@/entities/vowel";
import { lexiconQueries } from "@/entities/lexicon";
import { BuilderPage } from "@/pages/builder";

export const metadata: Metadata = {
  title: "Ghép chữ / Build syllables – NarakThai",
};

/** Prefetch trên server rồi hydrate xuống client: đổi sang API thật không cần sửa widget. */
export default async function Page() {
  const qc = new QueryClient();
  await Promise.all([
    qc.prefetchQuery(consonantQueries.all()),
    qc.prefetchQuery(consonantQueries.initials()),
    qc.prefetchQuery(vowelQueries.all()),
    qc.prefetchQuery(lexiconQueries.all()),
  ]);
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BuilderPage />
    </HydrationBoundary>
  );
}
