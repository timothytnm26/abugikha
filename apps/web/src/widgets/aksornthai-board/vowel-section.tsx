import { useState } from "react";
import { VOWELS, vowelGlyph } from "@/entities/vowel";
import { VOWEL_GROUPS, vowelGroup, type VowelGroup } from "@abugikha/core/vowel";
import { useT } from "@/shared/i18n";
import { GlyphButton } from "@/shared/ui";
import { SectionHeading } from "./section-heading";
import { MORPH_VOWEL_IDS, type Selected } from "./selection";
import { pill, vowelTile, vowelTileColor } from "./tiles";

export function VowelSection({ sel, onChoose }: { sel: Selected; onChoose: (s: Selected) => void }) {
  const t = useT();
  const [vGroup, setVGroup] = useState<"all" | VowelGroup>("all");
  return (
    <section aria-labelledby="vowel-title">
      <SectionHeading id="vowel-title" title={t.aksornthai.vowels}>
        {(["all", ...VOWEL_GROUPS] as const).map((g) => (
          <button key={g} type="button" aria-pressed={vGroup === g} onClick={() => setVGroup(g)} className={pill(vGroup === g)}>
            {g === "all" ? t.builder.filters.all : t.groups.vowels[g]}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-soft">{t.aksornthai.morphHint}</span>
      </SectionHeading>
      <div className="space-y-5">
        {VOWEL_GROUPS.filter((g) => vGroup === "all" || vGroup === g).map((g) => (
          <div key={g}>
            <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
              {t.groups.vowels[g]}
              <span className="text-xs font-normal text-ink-soft">{t.groups.vowelHints[g]}</span>
            </h3>
            {g === "diph" && <p className="mb-2 max-w-2xl text-sm text-ink/80">{t.groups.diphIntro}</p>}
            <ul className="flex flex-wrap gap-2">
              {VOWELS.filter((v) => vowelGroup(v) === g).map((vowel) => {
                const active = sel.kind === "vowel" && sel.item.id === vowel.id;
                const short = vowel.length === "short";
                const tile = vowelTile({ active, short, morph: MORPH_VOWEL_IDS.has(vowel.id), tile: vowelTileColor(g) });
                return (
                  <li key={vowel.id}>
                    <GlyphButton
                      active={active}
                      size="md"
                      glyph={vowelGlyph(vowel)}
                      glyphClassName="block whitespace-nowrap text-2xl leading-tight"
                      onClick={() => onChoose({ kind: "vowel", item: vowel })}
                      aria-label={`${vowelGlyph(vowel)}, /${vowel.ipa}/, ${vowel.length === "long" ? t.ipa.long : t.ipa.short}`}
                      // Viền nét đứt = nguyên âm ngắn (cùng quy ước với trang IPA và Ghép chữ)
                      className={tile.className}
                      style={tile.style}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
