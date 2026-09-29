import { describe, expect, it } from "vitest";
import { WORDS } from "../src/lexicon";
import { MORPH_BY_VOWEL, MORPH_RULES, buildMorph } from "../src/syllable";

const text = (xs: { text: string }[]) => xs.map((x) => x.text).join(" ");

describe("nguyên âm biến hình", () => {
  it.each([
    ["a", "วะ", "วัน", "ะ", "ั น"],
    ["e", "เตะ", "เต็ม", "ะ", "็ ม"],
    ["o", "โคะ", "คน", "โ ะ", "น"],
    ["or", "เลาะ", "ล็อก", "เ า ะ", "็ อ ก"],
    ["uue", "มือ", "มืด", "อ", "ด"],
    ["ooe", "เดอ", "เดิน", "อ", "ิ น"],
    ["ooe-y", "เลอ", "เลย", "อ", "ย"],
    ["iia", "เรีย", "เรียน", "", "น"],
    ["uua", "สัว", "สวน", "ั", "น"],
    ["taikhu", "เล็น", "เล่น", "็", "่"],
  ])("%s: %s → %s (bỏ %s, thêm %s)", (id, from, to, removed, added) => {
    const m = buildMorph(MORPH_RULES.find((r) => r.id === id)!);
    expect(m.from.spelling).toBe(from);
    expect(m.to.spelling).toBe(to);
    expect(text(m.removed)).toBe(removed);
    expect(text(m.added)).toBe(added);
  });

  it("dấu trên/dưới dính vào chữ đứng trước để hiển thị đúng", () => {
    const m = buildMorph(MORPH_RULES.find((r) => r.id === "a")!);
    expect(m.toTokens.map((t) => t.text)).toEqual(["วั", "น"]);
    expect(m.toTokens[0]!.key).toBe(m.fromTokens[0]!.key);
    expect(m.toTokens[0]).toMatchObject({ base: "ว", marks: [{ text: "ั", role: "vowel" }] });
  });

  it("dấu thanh trong cụm giữ vai trò riêng để tô màu", () => {
    const m = buildMorph(MORPH_RULES.find((r) => r.id === "taikhu")!);
    expect(m.fromTokens[1]!.marks).toEqual([{ text: "็", role: "vowel" }]);
    expect(m.toTokens[1]!.marks).toEqual([{ text: "่", role: "mark" }]);
  });

  it("mọi ví dụ dạng đóng đều có trong từ điển với IPA khớp engine", () => {
    for (const r of MORPH_RULES) {
      const m = buildMorph(r);
      const word = WORDS.find((w) => w.thai === m.to.spelling);
      expect(word, m.to.spelling).toBeDefined();
      expect(word!.ipa.normalize("NFC"), m.to.spelling).toBe(m.to.ipa.normalize("NFC"));
    }
  });

  it("mỗi nguyên âm có quy tắc chính riêng", () => {
    expect([...MORPH_BY_VOWEL.keys()].sort()).toEqual(["a", "ae", "e", "iia", "o", "ooe", "or", "uua", "uue", "uuea"]);
  });
});
