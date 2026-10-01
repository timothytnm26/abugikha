"use client";
import Link from "next/link";
import { LEARNING_PATH } from "@/shared/config/routes";
import { fmt, useLocalePath, useT } from "@/shared/i18n";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/timothytnm26/abugikha",
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1-.07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z",
  },
] as const;

/** Chân trang: logo, các bước học, mạng xã hội và bản quyền. */
export function SiteFooter() {
  const t = useT();
  const href = useLocalePath();
  return (
    <footer className="border-t border-ink/10 bg-paper-deep/60">
      <div className="page-container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:py-12">
        <div>
          <Link href={href("/")} className="inline-flex items-baseline gap-2 leading-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" aria-label={t.nav.brandLabel}>
            <span lang="th" className="font-thai text-3xl font-semibold">
              น่ารัก<span className="text-tone-falling">ไทย</span>
            </span>
            <span className="text-xs font-medium tracking-wide text-ink-soft">NarakThai</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{t.home.footer.tagline}</p>
        </div>
        <nav aria-label={t.home.footer.explore}>
          <p className="text-sm font-semibold">{t.home.footer.explore}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {LEARNING_PATH.map((p) => (
              <li key={p.href}>
                <Link href={href(p.href)} className="hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  {t.routes[p.key].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold">{t.home.footer.follow}</p>
          <ul className="mt-3 flex gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="btn btn-outline btn-icon">
                  <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="page-container flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-ink-soft">
          <p>{fmt(t.home.footer.copyright, { year: new Date().getFullYear() })}</p>
          <a href="#top" className="hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            ↑ {t.home.footer.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
