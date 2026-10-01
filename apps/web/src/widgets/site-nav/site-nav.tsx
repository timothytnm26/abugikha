"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LEARNING_PATH, stripLocale } from "@/shared/config/routes";
import { useLocalePath, useT } from "@/shared/i18n";
import { LocaleSwitch } from "@/features/toggle-locale";
import { ThemeSwitch } from "@/features/toggle-theme";
import { SettingsMenu } from "@/features/customize-appearance";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";

/** Thanh điều hướng trên cùng; màn hình hẹp gom các bước vào menu hamburger. */
export function SiteNav() {
  const pathname = usePathname();
  const path = stripLocale(pathname ?? "/");
  const href = useLocalePath();
  const t = useT();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !panel.current?.contains(e.target as Node) &&
        !button.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      gsap.fromTo(
        panel.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
      );
      gsap.fromTo(
        ".menu-item",
        { x: -12, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.05 },
      );
    },
    { dependencies: [open], scope: panel },
  );

  return (
    <div className="relative">
      <nav
        aria-label={t.nav.path}
        className="mx-auto flex h-14 max-w-[1440px] items-center gap-1.5 px-3 sm:gap-2 sm:px-4 md:px-6"
      >
        <Link
          href={href("/")}
          className="group mr-2 flex shrink-0 items-baseline gap-2 whitespace-nowrap leading-none md:mr-4"
          aria-label={t.nav.brandLabel}
        >
          <span lang="th" className="font-thai text-xl font-semibold sm:text-2xl">
            น่ารัก<span className="text-poster-lime">ไทย</span>
          </span>
          <span className="hidden font-poster text-base font-semibold uppercase tracking-wide text-white/75 min-[420px]:inline">NarakThai</span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {LEARNING_PATH.map((item) => {
            const active = path === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={href(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center whitespace-nowrap px-4 font-poster text-lg font-bold uppercase tracking-wide focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white",
                    active
                      ? "bg-poster-lime text-poster-black"
                      : "text-white hover:bg-white/15",
                  )}
                >
                  {t.routes[item.key].title}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitch />
          <ThemeSwitch />
          <SettingsMenu />
          <button
            ref={button}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="nav-btn lg:hidden"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4 stroke-current stroke-2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={panel}
          id="site-menu"
          className="absolute inset-x-0 top-full border-t-2 border-poster-lime bg-poster-black px-4 pb-6 pt-2 text-white lg:hidden"
        >
          <ol className="space-y-1">
            {LEARNING_PATH.map((item) => {
              const active = path === item.href;
              return (
                <li key={item.href} className="menu-item">
                  <Link
                    href={href(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex gap-3 p-3 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white",
                      active ? "bg-poster-lime text-poster-black" : "hover:bg-white/15",
                    )}
                  >
                    <span>
                      <span className="block font-poster text-2xl font-bold uppercase leading-tight">
                        {t.routes[item.key].title}
                      </span>
                      <span
                        className={cn(
                          "block text-sm",
                          active ? "opacity-80" : "text-white/75",
                        )}
                      >
                        {t.routes[item.key].blurb}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
