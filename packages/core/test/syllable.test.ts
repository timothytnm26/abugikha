import { describe, expect, it } from "vitest";
import { CONSONANT_BY_ID, INITIAL_BY_ID } from "../src/consonant";
import { VOWEL_BY_ID } from "../src/vowel";
import { analyzeSyllable, type ToneMarkId } from "../src/syllable";

function build(initial: string, vowel: string, opts: { final?: string; mark?: ToneMarkId } = {}) {
  const unit = INITIAL_BY_ID.get(initial);
  const v = VOWEL_BY_ID.get(vowel);
  if (!unit || !v) throw new Error(`Không có dữ liệu cho ${initial} / ${vowel}`);
  const final = opts.final ? CONSONANT_BY_ID.get(opts.final) : null;
  return analyzeSyllable({ initial: unit, vowel: v, final, mark: opts.mark ?? null });
}

describe("analyzeSyllable – quy tắc thanh", () => {
  it.each([
    ["ก", "aa", {}, "กา", "mid"],
    ["ข", "aa", {}, "ขา", "rising"],
    ["ค", "aa", {}, "คา", "mid"],
    ["ก", "a", {}, "กะ", "low"],
    ["ค", "a", {}, "คะ", "high"],
    ["ค", "aa", { mark: "ek" }, "ค่า", "falling"],
    ["ค", "aa", { mark: "tho" }, "ค้า", "high"],
    ["ก", "aa", { mark: "ek" }, "ก่า", "low"],
    ["ม", "aa", { final: "ก" }, "มาก", "falling"],
    ["ห", "aa", { final: "ก" }, "หาก", "low"],
  ] as const)("%s + %s %o → %s (%s)", (initial, vowel, opts, spelling, tone) => {
    const a = build(initial, vowel, opts);
    expect(a.spelling).toBe(spelling);
    expect(a.tone).toBe(tone);
  });

  it("phụ âm dẫn ห: หน้า mang thanh rơi, dấu thanh đặt trên chữ cuối của cụm", () => {
    const a = build("หน", "aa", { mark: "tho" });
    expect(a.spelling).toBe("หน้า");
    expect(a.tone).toBe("falling");
    expect(a.cls).toBe("high");
  });

  it("dấu thanh đi sau nguyên âm trên/dưới trong cụm phụ âm: ใกล้", () => {
    expect(build("กล", "ai-muan", { mark: "tho" }).spelling).toBe("ใกล้");
  });

  it("âm tiết kết thúc bằng âm tắc là âm tiết chết", () => {
    expect(build("ม", "aa", { final: "ก" }).liveness).toBe("dead");
    expect(build("ม", "aa", { final: "น" }).liveness).toBe("live");
  });

  it("mỗi bước giải thích có màu nhấn là khoá palette, không phải CSS", () => {
    const a = build("ค", "aa", { mark: "ek" });
    const accents = a.steps.map((s) => s.accent).filter(Boolean);
    expect(accents).toContain("low");
    expect(accents).toContain("tone-falling");
  });

  it("เ-อ gặp ย cuối viết là เ-ย: เลย", () => {
    expect(build("ล", "ooe", { final: "ย" }).spelling).toBe("เลย");
    expect(build("ด", "ooe", { final: "น" }).spelling).toBe("เดิน");
  });

  it("trả lời theo locale", () => {
    const unit = INITIAL_BY_ID.get("ก")!;
    const v = VOWEL_BY_ID.get("aa")!;
    const vi = analyzeSyllable({ initial: unit, vowel: v }, "vi");
    const en = analyzeSyllable({ initial: unit, vowel: v }, "en");
    expect(vi.steps[0]!.title).not.toBe(en.steps[0]!.title);
  });
});
