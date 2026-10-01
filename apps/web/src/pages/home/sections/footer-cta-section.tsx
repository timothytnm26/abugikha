'use client';
import Link from 'next/link';
import { useLocalePath, useT } from '@/shared/i18n';

export function FooterCtaSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section className="screen relative overflow-hidden">
      <div className="page-container relative w-full py-14 md:py-16">
        <div data-tape className="note-paper mx-auto max-w-3xl rounded-3xl px-6 py-14 text-center md:py-20">
          <h2 className="text-3xl font-semibold md:text-5xl">{t.home.footerTitle}</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-soft md:text-lg">{t.home.footerBody}</p>
          <Link href={href('/lab')} className="btn btn-primary btn-hero mt-8">
            {t.home.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
