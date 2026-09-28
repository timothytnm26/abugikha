import { queryOptions } from "@tanstack/react-query";
import { VOWELS } from "@abugikha/core/vowel";

/** Xem ghi chú ở consonantQueries. */
export const vowelQueries = {
  all: () => queryOptions({ queryKey: ["vowels"], queryFn: async () => VOWELS, initialData: VOWELS, staleTime: Infinity }),
};
