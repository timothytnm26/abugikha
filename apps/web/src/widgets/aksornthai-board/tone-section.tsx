import { TONE_MARKS } from "@/entities/syllable";
import { useT } from "@/shared/i18n";
import { GlyphButton } from "@/shared/ui";
import { SectionHeading } from "./section-heading";
import { MARK_MORPHS, type Selected } from "./selection";
import { glyphTile } from "./tiles";

export function ToneSection({ sel, onChoose }: { sel: Selected; onChoose: (s: Selected) => void }) {
  const t = useT();
  return (
    <section aria-labelledby="tone-title">
      <SectionHeading id="tone-title" title={t.aksornthai.tones}>
        <span className="ml-auto text-xs text-ink-soft">{t.aksornthai.morphHint}</span>
      </SectionHeading>
      <ul className="flex flex-wrap gap-2">
        {TONE_MARKS.map((m) => {
          const active = sel.kind === "tone" && sel.item.id === m.id;
          return (
            <li key={m.id}>
              <GlyphButton
                active={active}
                size="md"
                glyph={`◌${m.char}`}
                glyphClassName="text-4xl leading-tight"
                onClick={() => onChoose({ kind: "tone", item: m })}
                aria-label={`${m.thai}, ${m.latin}`}
                className={glyphTile({ active, morph: MARK_MORPHS.length > 0 })}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
