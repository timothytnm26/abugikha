'use client';
import Link from 'next/link';
import { LEARNING_PATH } from '@/shared/config/routes';
import { useLocalePath, useT } from '@/shared/i18n';

const STEP_COLORS = ['var(--color-mid)', 'var(--color-tone-falling)', 'var(--color-part-vowel)', 'var(--color-low)'];
const STEP_NUMERALS = ['๑', '๒', '๓', '๔'];

export function LearningPathSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section aria-labelledby="path-title" className="screen scroll-mt-14">
      <div className="page-container w-full py-14 md:py-16">
      <div className="mb-6 md:mb-8">
        <h2 id="path-title" className="section-title">
          {t.home.pathTitle}
        </h2>
        <p className="mt-1 text-ink-soft">{t.home.pathBlurb}</p>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LEARNING_PATH.map((p, i) => (
          <li key={p.href}>
            <Link href={href(p.href)} data-tape className="note-paper path-card">
              <span lang="th" className="note-glyph font-thai text-5xl leading-none" style={{ color: STEP_COLORS[i] }}>
                {STEP_NUMERALS[p.step - 1]}
              </span>
              <span className="text-lg font-semibold">{t.routes[p.key].title}</span>
              <span className="text-sm leading-relaxed text-ink-soft">{t.routes[p.key].blurb}</span>
            </Link>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}
