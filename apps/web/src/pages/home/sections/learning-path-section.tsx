'use client';
import Link from 'next/link';
import { LEARNING_PATH } from '@/shared/config/routes';
import { useLocalePath, useT } from '@/shared/i18n';
import { cn } from '@/shared/lib';

const STEP_COLORS = ['var(--color-mid)', 'var(--color-tone-falling)', 'var(--color-part-vowel)', 'var(--color-low)'];
const STEP_NUMERALS = ['๑', '๒', '๓', '๔'];
/** Mỗi chặng lệch sang phải một bậc như đang bước lên, nên lộ trình là một con đường chứ không phải bốn thẻ bằng nhau */
const STEP_OFFSET = ['lg:ml-0', 'lg:ml-[9%]', 'lg:ml-[18%]', 'lg:ml-[27%]'];

export function LearningPathSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section aria-labelledby="path-title" className="screen scroll-mt-14">
      <div className="page-container w-full py-14 md:py-16">
        <h2 id="path-title" className="border-t-2 border-ink pt-6 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-5xl">
          {t.home.pathTitle}
        </h2>
        <p className="mt-3 max-w-[52ch] text-ink-soft md:text-lg">{t.home.pathBlurb}</p>
        <ol className="mt-8 md:mt-12">
          {LEARNING_PATH.map((p, i) => {
            const last = i === LEARNING_PATH.length - 1;
            return (
              <li key={p.href} className={cn('relative', STEP_OFFSET[i])}>
                <Link
                  href={href(p.href)}
                  className={cn(
                    'group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:gap-8 lg:max-w-3xl',
                    last ? 'note-paper my-4 rounded-none border-ink! px-5 shadow-none! md:px-8 md:py-7' : 'border-b border-ink/25',
                  )}
                >
                  <span lang="th" className="note-glyph w-[1.1em] text-center font-thai text-6xl leading-none md:text-7xl" style={{ color: STEP_COLORS[i] }}>
                    {STEP_NUMERALS[p.step - 1]}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl font-semibold leading-snug md:text-3xl">{t.routes[p.key].title}</span>
                    <span className="mt-1 block max-w-[48ch] text-ink-soft md:text-lg">{t.routes[p.key].blurb}</span>
                  </span>
                  <span aria-hidden className="text-3xl leading-none transition-transform duration-200 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
