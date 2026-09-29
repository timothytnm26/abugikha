import { describe, expect, it } from "vitest";
import { ipaToRtgs } from "../src/romanize";

describe("ipaToRtgs", () => {
  it.each([
    ["nâː", "na"],
    ["kʰwaːj", "khwai"],
    ["mɛ̂ː náːm", "maenam"],
    ["tɕʰaːŋ", "chang"],
  ])("%s → %s", (ipa, rtgs) => {
    expect(ipaToRtgs(ipa)).toBe(rtgs);
  });
});
