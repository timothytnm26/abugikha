/**
 * IPA → RTGS (Royal Thai General System of Transcription, Viện Hoàng gia Thái Lan 1999).
 * RTGS không ghi thanh điệu và không phân biệt nguyên âm ngắn/dài;
 * âm cuối ย → -i, ว → -o; จ và ช/ฉ đều là "ch"; อ đầu âm tiết không viết.
 */
const TONE_MARKS = /[\u0300\u0301\u0302\u030C]/g;

const CONS: [string, string][] = [
  ["tɕʰ", "ch"], ["tɕ", "ch"], ["kʰ", "kh"], ["pʰ", "ph"], ["tʰ", "th"], ["ŋ", "ng"], ["ʔ", ""], ["j", "y"],
  ["k", "k"], ["t", "t"], ["p", "p"], ["b", "b"], ["d", "d"], ["m", "m"], ["n", "n"], ["f", "f"],
  ["s", "s"], ["h", "h"], ["l", "l"], ["r", "r"], ["w", "w"],
];
const VOWELS: [string, string][] = [
  ["ia", "ia"], ["ɯa", "uea"], ["ua", "ua"],
  ["a", "a"], ["i", "i"], ["ɯ", "ue"], ["u", "u"], ["e", "e"], ["ɛ", "ae"], ["o", "o"], ["ɔ", "o"], ["ɤ", "oe"],
];
const CODA: Record<string, string> = { j: "i", w: "o", ŋ: "ng", "ʔ": "", k: "k", t: "t", p: "p", m: "m", n: "n" };

function syllable(ipa: string): string {
  const s = ipa.normalize("NFD").replace(TONE_MARKS, "").replace(/ː/g, "");
  let i = 0;
  let onset = "";
  // Phụ âm đầu (có thể là cụm)
  outer: while (i < s.length) {
    for (const [v] of VOWELS) if (s.startsWith(v, i)) break outer;
    for (const [k, r] of CONS)
      if (s.startsWith(k, i)) {
        onset += r;
        i += k.length;
        continue outer;
      }
    i++;
  }
  let nucleus = "";
  for (const [k, r] of VOWELS)
    if (s.startsWith(k, i)) {
      nucleus = r;
      i += k.length;
      break;
    }
  const coda = s.slice(i);
  return onset + nucleus + (CODA[coda] ?? coda);
}

/** Âm tiết IPA ngăn bằng dấu chấm/khoảng trắng; RTGS viết liền cả từ. */
export function ipaToRtgs(ipa: string): string {
  return ipa.split(/[.\s]+/).filter(Boolean).map(syllable).join("");
}
