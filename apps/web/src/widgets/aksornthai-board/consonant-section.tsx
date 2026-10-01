import { useState } from 'react';
import { CLASS_META, CONSONANTS, INITIAL_UNITS, InitialFace, type ConsonantClass, type InitialKind } from '@/entities/consonant';
import { useLocale, useT } from '@/shared/i18n';
import { cn, tint } from '@/shared/lib';
import { GlyphButton } from '@/shared/ui';
import { SectionHeading } from './section-heading';
import type { Selected } from './selection';
import { CLASS_RING, pill } from './tiles';

/** Cụm đọc liền / chữ nhấn, xếp dưới bảng phụ âm đơn */
const COMBO_GROUPS: { kind: InitialKind; label: 'cluster' | 'falseCluster' | 'leading'; hint: 'clusterHint' | 'falseClusterHint' | 'leadingHint' }[] = [
  { kind: 'cluster', label: 'cluster', hint: 'clusterHint' },
  { kind: 'false-cluster', label: 'falseCluster', hint: 'falseClusterHint' },
  { kind: 'leading', label: 'leading', hint: 'leadingHint' },
];

export function ConsonantSection({ sel, onChoose }: { sel: Selected; onChoose: (s: Selected) => void }) {
  const t = useT();
  const { locale } = useLocale();
  const [cls, setCls] = useState<'all' | ConsonantClass>('all');
  return (
    <section aria-labelledby="cons-title">
      <SectionHeading id="cons-title" title={t.aksornthai.consonants}>
        {(['all', 'mid', 'high', 'low'] as const).map((c) => (
          <button key={c} type="button" aria-pressed={cls === c} onClick={() => setCls(c)} className={cn(pill(cls === c), cls === c && c !== 'all' && `${CLASS_META[c].bg} text-on-accent`)}>
            {c === 'all' ? t.builder.filters.all : CLASS_META[c].label[locale]}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-soft">{t.aksornthai.rareHint}</span>
      </SectionHeading>
      <ul className="flex flex-wrap gap-2">
        {CONSONANTS.map((c) => {
          const active = sel.kind === 'consonant' && sel.item.char === c.char;
          const hidden = cls !== 'all' && c.cls !== cls;
          return (
            <li key={c.char} className={cn(hidden && 'hidden')}>
              <GlyphButton
                active={active}
                size="md"
                glyph={c.char}
                glyphClassName={cn('text-4xl leading-none', c.obsolete && 'line-through decoration-2')}
                onClick={() => onChoose({ kind: 'consonant', item: c })}
                aria-label={`${c.char}, ${c.name}, ${CLASS_META[c.cls].label[locale]}`}
                className={cn('relative flex flex-col items-center justify-center transition-[scale] hover:scale-105', (c.common || active) && `${CLASS_META[c.cls].bg} text-on-accent`, active && `ring-2 ring-offset-2 ring-offset-paper ${CLASS_RING[c.cls]}`)}
                // Chữ ít gặp: nền và viền nhạt đi, chữ vẫn rõ
                style={
                  !c.common && !active ?
                    {
                      backgroundColor: tint(CLASS_META[c.cls].color, 14),
                      color: CLASS_META[c.cls].ink,
                      boxShadow: `inset 0 0 0 1.5px ${tint(CLASS_META[c.cls].color, 35)}`,
                    }
                  : undefined
                }
              />
            </li>
          );
        })}
      </ul>
      <div className="mt-6 space-y-4 border-t border-dashed border-ink/15 pt-4">
        {COMBO_GROUPS.map(({ kind, label, hint }) => {
          const units = INITIAL_UNITS.filter((u) => u.kind === kind && (cls === 'all' || u.cls === cls));
          if (units.length === 0) return null;
          return (
            <div key={kind}>
              <h3 className="mb-2 flex flex-wrap items-baseline gap-2 text-sm font-medium">
                {t.groups[label]}
                <span className="text-xs font-normal text-ink-soft">{t.groups[hint]}</span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {units.map((u) => {
                  const active = sel.kind === 'initial' && sel.item.id === u.id;
                  return (
                    <li key={u.id}>
                      <GlyphButton active={active} onClick={() => onChoose({ kind: 'initial', item: u })} aria-label={`${u.chars}, /${u.ipa}/, ${CLASS_META[u.cls].label[locale]}`} className="block transition-[scale] hover:scale-105">
                        <InitialFace unit={u} size="sm" phonetic={false} selected={active} muted={!u.common} className="h-18 min-w-18" />
                      </GlyphButton>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
