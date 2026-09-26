import { queryOptions } from "@tanstack/react-query";
import { CONSONANTS } from "../model/data";
import { INITIAL_UNITS } from "../model/initials";

/**
 * Dữ liệu hiện là tĩnh, nhưng đi qua TanStack Query để sau này
 * đổi sang API/CMS chỉ cần sửa queryFn.
 */
export const consonantQueries = {
  all: () => queryOptions({ queryKey: ["consonants"], queryFn: async () => CONSONANTS, staleTime: Infinity }),
  initials: () => queryOptions({ queryKey: ["initial-units"], queryFn: async () => INITIAL_UNITS, staleTime: Infinity }),
};
