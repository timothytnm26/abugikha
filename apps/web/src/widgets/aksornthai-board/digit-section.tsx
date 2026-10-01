import { DIGITS } from "@/entities/writing";
import { useT } from "@/shared/i18n";
import { GlyphButton } from "@/shared/ui";
import { SectionHeading } from "./section-heading";
import type { Selected } from "./selection";
import { glyphTile } from "./tiles";

export function DigitSection({ sel, onChoose }: { sel: Selected; onChoose: (s: Selected) => void }) {
  const t = useT();
  return (
    <section aria-labelledby="digit-title">
      <SectionHeading id="digit-title" title={t.aksornthai.digits} />
      <ul className="flex flex-wrap gap-2">
        {DIGITS.map((d) => {
          const active = sel.kind === "digit" && sel.item.char === d.char;
          return (
            <li key={d.char}>
              <GlyphButton
                active={active}
                size="md"
                glyph={d.char}
                glyphClassName="text-4xl leading-none"
                onClick={() => onChoose({ kind: "digit", item: d })}
                aria-label={`${d.char}, ${d.value}`}
                className={glyphTile({ active, morph: false })}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
