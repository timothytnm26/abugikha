import { queryOptions } from "@tanstack/react-query";
import { WORDS } from "@abugikha/core/lexicon";

/** Xem ghi chú ở consonantQueries. */
export const lexiconQueries = {
  all: () => queryOptions({ queryKey: ["lexicon"], queryFn: async () => WORDS, initialData: WORDS, staleTime: Infinity }),
};
