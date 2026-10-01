'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SYLLABLE_EXAMPLES, useBuilderStore } from '@/features/build-syllable';
import { useLocalePath, useT } from '@/shared/i18n';

export function FooterCtaSection() {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const setSyllable = useBuilderStore((s) => s.setSyllable);
  return (
    <section className="screen relative">
      <div className="page-container w-full py-14 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-balance border-t-2 border-ink pt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] md:text-6xl">{t.home.footerTitle}</h2>
            <p className="mt-5 max-w-[46ch] text-ink-soft md:text-lg">{t.home.footerBody}</p>
            <Link href={href('/lab')} className="btn btn-flat btn-primary mt-8">
              {t.home.cta}
            </Link>
          </div>
          {/* Mỗi ví dụ nạp sẵn âm tiết vào trang ghép rồi mở trang đó, nên người đọc thử được ngay mà không cần chọn từ đầu */}
          <div className="note-paper rounded-none border-ink! px-6 py-8 shadow-none! md:px-9">
            <p className="text-sm text-ink/80">{t.builder.coach.try}</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {SYLLABLE_EXAMPLES.map((e) => (
                <li key={e.word}>
                  <button
                    type="button"
                    lang="th"
                    onClick={() => {
                      setSyllable(e);
                      router.push(href('/lab'));
                    }}
                    className="note-glyph min-h-16 min-w-16 border-2 border-ink/30 bg-paper px-4 font-thai text-5xl leading-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {e.word}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-soft">{t.builder.coach.tryHint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
