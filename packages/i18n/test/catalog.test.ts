import { describe, expect, it } from "vitest";
import { CATALOGS, DEFAULT_LOCALE, LOCALES, fmt, l10n, l10nList, l10nOptional } from "../src";

type Leaf = [path: string, value: string];
const leaves = (node: unknown, path = ""): Leaf[] =>
  typeof node === "string"
    ? [[path, node]]
    : Object.entries(node as Record<string, unknown>).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)(?:\|\w+)?\}/g)].map((m) => m[1]).sort();

const base = new Map(leaves(CATALOGS[DEFAULT_LOCALE]));

describe.each(LOCALES.filter((l) => l !== DEFAULT_LOCALE))("locales/%s", (locale) => {
  const other = new Map(leaves(CATALOGS[locale]));

  it("có đủ mọi chuỗi của locale mặc định, không thừa", () => {
    expect([...other.keys()].filter((k) => !base.has(k))).toEqual([]);
    expect([...base.keys()].filter((k) => !other.has(k))).toEqual([]);
  });

  it("dùng đúng các tham số {…} như locale mặc định", () => {
    const wrong = [...base].filter(([k, v]) => other.has(k) && placeholders(v).join() !== placeholders(other.get(k)!).join());
    expect(wrong.map(([k]) => k)).toEqual([]);
  });
});

describe("fmt", () => {
  it("chèn tham số và bộ lọc", () => {
    expect(fmt("Bước {n} / {total}", { n: 2, total: 5 })).toBe("Bước 2 / 5");
    expect(fmt("Remove {part|lower}", { part: "Final" })).toBe("Remove final");
  });
  it("giữ nguyên placeholder không có tham số", () => {
    expect(fmt("{a} {b}", { a: "x" })).toBe("x {b}");
  });
});

describe("l10n", () => {
  it("gom chuỗi của mọi locale", () => {
    expect(l10n(["lexicon", "กา"])).toEqual({ vi: "con quạ", en: "crow" });
    expect(l10n(["initials", "silentHo"], { chars: "หน", ipa: "n" }).en).toContain("หน is read /n/");
  });
  it("trường tuỳ chọn và mảng", () => {
    expect(l10nOptional(["vowels", "closedNote", "aa"])).toBeUndefined();
    expect(l10nList(["scriptHistory", "eras", "brahmi", "facts"])).toHaveLength(3);
  });
  it("ném lỗi khi locale mặc định thiếu chuỗi", () => {
    expect(() => l10n(["lexicon", "không-có"])).toThrow(/lexicon\.không-có/);
  });
});
