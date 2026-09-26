import { queryOptions } from "@tanstack/react-query";
import { WORDS } from "../model/data";

export const lexiconQueries = {
  all: () => queryOptions({ queryKey: ["lexicon"], queryFn: async () => WORDS, staleTime: Infinity }),
};
