import type { Word } from "../model/types";

export interface WordMatches {
  exact: Word | null;
  compounds: Word[];
}

/** Tìm từ trùng với âm tiết, và các từ ghép có chứa nó. */
export function findWords(words: Word[], spelling: string): WordMatches {
  const s = spelling.normalize("NFC");
  return {
    exact: words.find((w) => !w.parts && w.thai.normalize("NFC") === s) ?? null,
    compounds: words.filter((w) => w.parts?.some((p) => p.normalize("NFC") === s)),
  };
}
