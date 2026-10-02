'use client';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Asterisk } from './poster-tile';

/** Đầu trang công cụ: dấu sao cam, tít condensed rất lớn và một câu dẫn, tất cả trên nền giấy. */
export function PageIntro({ title, children, compact }: { title: string; children: ReactNode; compact?: boolean }) {
  return (
    <header className={cn('page-container pb-4 pt-10 md:pb-6 md:pt-20', compact && 'xl:flex xl:items-end xl:gap-6 xl:pb-3 xl:pt-5')}>
      <Asterisk className={cn('size-8 text-note-orange md:size-10', compact && 'xl:mb-2 xl:size-8')} />
      <h1 className={cn('mt-3 text-balance font-poster text-6xl font-extrabold uppercase text-pastel leading-[0.92] md:text-9xl', compact && 'xl:mt-0 xl:text-6xl')}>{title}</h1>
      <div className={cn('mt-5 max-w-[56ch] text-lg leading-snug text-ink-soft md:text-xl', compact && 'xl:mt-0 xl:pb-1 xl:text-base')}>{children}</div>
    </header>
  );
}
