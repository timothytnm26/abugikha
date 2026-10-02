import { useState } from 'react';
import { CLASS_META, CONSONANTS, INITIAL_UNITS, InitialFace, type ConsonantClass, type InitialKind, type InitialUnit } from '@/entities/consonant';
import { useLocale, useT } from '@/shared/i18n';
import { cn, tint } from '@/shared/lib';
import { GlyphButton } from '@/shared/ui';
import { SectionHeading } from './section-heading';
import type { Selected } from './selection';
import { CLASS_FILTERS, CLASS_ORDER, CLASS_RING, pill, softClassStyle } from './tiles';

/** Cụm đọc liền / chữ nhấn, xếp dưới bảng phụ âm đơn */
const COMBO_GROUPS: { kind: InitialKind; label: 'cluster' | 'falseCluster' | 'leading'; hint: 'clusterHint' | 'falseClusterHint' | 'leadingHint' }[] = [
  { kind: 'cluster', label: 'cluster', hint: 'clusterHint' },
  { kind: 'false-cluster', label: 'falseCluster', hint: 'falseClusterHint' },
  { kind: 'leading', label: 'leading', hint: 'leadingHint' },
];

/** Gom các cụm theo chữ đầu (ก: กร กล กว) và xếp các nhóm theo giữa - cao - thấp */
const groupByHead = (units: InitialUnit[]) => {
  const byHead = Map.groupBy(units, (u) => u.head);
  return [...byHead.values()].sort((a, b) => CLASS_ORDER.indexOf(a[0].cls) - CLASS_ORDER.indexOf(b[0].cls));
};

export function ConsonantSection({ sel, onChoose }: { sel: Selected; onChoose: (s: Selected) => void }) {
  const t = useT();
  const { locale } = useLocale();
  const [cls, setCls] = useState<'all' | ConsonantClass>('all');
  return (
    <section aria-labelledby="cons-title">
      <SectionHeading id="cons-title" title={t.aksornthai.consonants}>
        {CLASS_FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cls === c}
            onClick={() => setCls(c)}
            className={pill(cls === c)}
            // Chưa chọn: kiểu nhạt như ô chữ ít gặp của nhóm; đang chọn: nền đặc màu nhóm.
            // Dùng style inline vì bg-ink của pill(on) và bg-{nhóm} xung đột, thắng thua tuỳ thứ tự CSS chứ không theo thứ tự class.
            style={
              c === 'all' ? undefined
              : cls === c ?
                { backgroundColor: CLASS_META[c].color, color: 'var(--color-on-accent)' }
              : softClassStyle(c)
            }
          >
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
                glyphClassName={cn('text-3xl leading-none', c.obsolete && 'line-through decoration-2')}
                onClick={() => onChoose({ kind: 'consonant', item: c })}
                aria-label={`${c.char}, ${c.name}, ${CLASS_META[c.cls].label[locale]}`}
                className={cn('relative flex flex-col items-center justify-center rounded-lg transition-[scale] hover:scale-105', (c.common || active) && `${CLASS_META[c.cls].bg} text-on-accent`, active && `ring-2 ring-offset-2 ring-offset-paper ${CLASS_RING[c.cls]}`)}
                // Chữ ít gặp: nền và viền nhạt đi, chữ vẫn rõ
                style={!c.common && !active ? softClassStyle(c.cls) : undefined}
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
                {groupByHead(units).map((group) => (
                  <li key={group[0].head}>
                    {/* Mỗi chữ đầu một khung cùng màu nhóm, để thấy cụm nào đi với chữ nào */}
                    <ul className="flex flex-wrap gap-2 rounded-xl p-2" style={{ backgroundColor: tint(CLASS_META[group[0].cls].color, 12) }}>
                      {group.map((u) => {
                        const active = sel.kind === 'initial' && sel.item.id === u.id;
                        return (
                          <li key={u.id}>
                            <GlyphButton active={active} onClick={() => onChoose({ kind: 'initial', item: u })} aria-label={`${u.chars}, /${u.ipa}/, ${CLASS_META[u.cls].label[locale]}`} className="block rounded-lg transition-[scale] hover:scale-105">
                              <InitialFace unit={u} size="sm" phonetic={false} selected={active} muted={!u.common} className="h-14 min-w-14 rounded-lg" />
                            </GlyphButton>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
