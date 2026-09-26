import { queryOptions } from "@tanstack/react-query";
import { VOWELS } from "../model/data";

export const vowelQueries = {
  all: () => queryOptions({ queryKey: ["vowels"], queryFn: async () => VOWELS, staleTime: Infinity }),
};
