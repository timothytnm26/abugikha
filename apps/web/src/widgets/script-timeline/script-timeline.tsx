"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { SCRIPT_ERAS, branchesOf, type GlyphFont, type ScriptBranch, type ScriptEra } from "@/entities/script-history";
import { gsap, useGSAP, type ScrollTrigger } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";

/** Chỉ ghim và cuộn ngang khi đủ chỗ (khớp variant `tall` trong globals.css) và người dùng không tắt chuyển động. */
const PINNED_QUERY = "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";

const glyphFont = (font?: GlyphFont): CSSProperties | undefined => (font ? { fontFamily: `var(--font-${font})` } : undefined);
const initials = (name: string) => name.slice(0, 2);

/** Nhánh phụ: màu xám, nét đứt, luôn hiện đủ chữ nhưng không tranh với dòng chính. */
function BranchChip({ branch }: { branch: ScriptBranch }) {
  const { locale } = useLocale();
  return (
    <li className="tl-branch relative min-w-0 flex-1 tall:max-w-[15rem]">
      <div className="h-full rounded-2xl border border-dashed border-ink/25 bg-paper-deep/60 p-3 text-ink-soft">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/10 text-lg leading-none text-ink-soft"
            style={glyphFont(branch.font)}
          >
            {branch.ka ?? initials(branch.name.en)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold leading-tight text-ink">{branch.name[locale]}</span>
            <span className="block text-[11px] leading-tight">{branch.period[locale]}</span>
          </span>
        </div>
        <p className="mt-2 text-xs leading-snug">{branch.note[locale]}</p>
      </div>
      {/* Cuống nối xuống dòng chính, chỉ vẽ khi cả cụm nằm trên trục */}
      <span aria-hidden className="absolute left-1/2 top-full hidden h-[calc(3rem+0.75rem)] -translate-x-1/2 border-l-2 border-dashed border-ink/25 tall:block" />
      <span aria-hidden className="absolute left-1/2 top-[calc(100%+3rem+0.75rem)] hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/25 tall:block" />
    </li>
  );
}

function EraColumn({ era, index, last }: { era: ScriptEra; index: number; last: boolean }) {
  const t = useT();
  const { locale } = useLocale();
  const branches = branchesOf(era.id);
  const nodeColor = last ? "bg-tone-falling" : "bg-mid";
  return (
    <section
      aria-labelledby={`era-${era.id}`}
      data-era={index}
      className="tl-col tl-era relative flex w-[88vw] max-w-[36rem] shrink-0 snap-start flex-col gap-4 py-6 tall:grid tall:h-full tall:w-[58rem] tall:max-w-none tall:grid-rows-[1fr_6rem_clamp(16rem,34svh,20rem)] tall:gap-0 tall:py-0 tall:pb-2"
    >
      {/* Trên trục: các nhánh xám */}
      {branches.length > 0 && (
        <div className="order-3 tall:order-none tall:flex tall:items-end tall:pb-3 tall:pl-24 tall:pr-4">
          <div className="w-full">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-soft tall:hidden">{t.history.branchesLabel}</p>
            <ul className="flex flex-col gap-2 tall:flex-row tall:gap-3">
              {branches.map((b) => (
                <BranchChip key={b.id} branch={b} />
              ))}
            </ul>
          </div>
        </div>
      )}
      {branches.length === 0 && (
        <div aria-hidden className="relative hidden overflow-hidden tall:block">
          <span className="absolute bottom-0 left-24 select-none text-[13rem] leading-[0.8] text-ink/[0.06]" style={glyphFont(era.font)}>
            {era.ka ?? initials(era.name.en)}
          </span>
        </div>
      )}

      {/* Trục thời gian */}
      <div className="relative order-1 h-24 tall:order-none" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/15" />
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full">
          <div className={cn("tl-fill size-full origin-left", nodeColor)} />
        </div>
        <div className="absolute left-6 top-1/2 size-[4.5rem] -translate-y-1/2 tall:left-10">
          <span className="absolute inset-0 grid place-items-center rounded-full border-2 border-ink/20 bg-paper text-3xl text-ink/35" style={glyphFont(era.font)}>
            {era.ka ?? initials(era.name.en)}
          </span>
          <span
            className={cn("tl-node-on absolute inset-0 grid place-items-center rounded-full text-3xl text-on-accent shadow-lg ring-4 ring-paper", nodeColor)}
            style={glyphFont(era.font)}
          >
            {era.ka ?? initials(era.name.en)}
          </span>
        </div>
      </div>

      {/* Thẻ giải thích chặng */}
      <article data-tape className="tl-card note-paper relative order-2 mx-0 overflow-hidden rounded-3xl p-5 tall:order-none tall:mx-6 tall:mt-3 tall:p-6">
        <span aria-hidden className="tl-year pointer-events-none absolute -bottom-6 right-3 select-none text-[8rem] font-bold leading-none tracking-tighter text-ink/[0.05]">
          {era.year[locale]}
        </span>
        <div className="relative grid gap-4 tall:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] tall:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-soft">{era.region[locale]} · {era.period[locale]}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
              <h2 id={`era-${era.id}`} className="text-2xl font-semibold leading-tight tall:text-3xl">{era.name[locale]}</h2>
              <span className={cn("rounded-full px-2.5 py-0.5 text-sm font-semibold text-on-accent", nodeColor)}>{era.year[locale]}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{era.summary[locale]}</p>
          </div>
          <div className="min-w-0 space-y-3">
            <ul className="space-y-1.5 text-[13px] leading-snug text-ink/80">
              {era.facts.map((f) => (
                <li key={f.en} className="flex gap-2">
                  <span aria-hidden className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", nodeColor)} />
                  <span>{f[locale]}</span>
                </li>
              ))}
            </ul>
            <p className="rounded-xl bg-paper-deep px-3 py-2 text-[13px] leading-snug">
              <span className="font-semibold">{t.history.changeLabel}: </span>
              {era.change[locale]}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

function IntroPanel() {
  const t = useT();
  return (
    <section
      aria-labelledby="timeline-title"
      className="tl-col flex w-[88vw] max-w-[36rem] shrink-0 snap-start flex-col justify-center gap-6 py-10 tall:h-full tall:w-[min(76rem,calc(100vw-2rem))] tall:max-w-none tall:flex-row tall:items-center tall:justify-between tall:gap-12 tall:px-16 tall:py-0"
    >
      <div className="tl-intro max-w-xl">
        <h1 id="timeline-title" className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">{t.history.title}</h1>
        <p className="mt-5 text-base leading-relaxed text-ink/80 md:text-lg">{t.history.intro}</p>
        <ul className="mt-6 space-y-2 text-sm text-ink-soft">
          <li className="flex items-center gap-3"><span aria-hidden className="h-1.5 w-10 rounded-full bg-mid" /> {t.history.mainLine}</li>
          <li className="flex items-center gap-3"><span aria-hidden className="w-10 border-t-2 border-dashed border-ink/25" /> {t.history.branchLine}</li>
        </ul>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper-deep px-4 py-2 text-sm font-medium text-ink-soft">
          {t.history.cue}
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2 [animation:nudge-x_1.4s_ease-in-out_infinite]" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </p>
      </div>
      {/* ตัว "ka" ของสามยุค: cùng một chữ, ba thời đại */}
      <div aria-hidden className="tl-intro flex items-center gap-3 self-center text-mid md:gap-5">
        <span className="text-6xl text-ink-soft md:text-8xl" style={glyphFont("brahmi")}>𑀓</span>
        <span className="text-2xl text-ink-soft">→</span>
        <span className="text-6xl text-ink-soft md:text-8xl" style={glyphFont("khmer")}>ក</span>
        <span className="text-2xl text-ink-soft">→</span>
        <span lang="th" className="font-thai text-7xl md:text-[9rem]">ก</span>
      </div>
    </section>
  );
}

function EndPanel() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section className="tl-col flex w-[88vw] max-w-[36rem] shrink-0 snap-start items-center justify-center py-10 tall:h-full tall:w-[min(52rem,calc(100vw-2rem))] tall:max-w-none tall:py-0">
      <div className="max-w-md text-center">
        <span lang="th" aria-hidden className="font-thai text-8xl leading-none text-tone-falling">ก</span>
        <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">{t.history.endTitle}</h2>
        <p className="mt-3 text-ink/80">{t.history.endBody}</p>
        <Link href={href("/lab")} className="btn btn-primary mt-6">
          {t.history.endCta} →
        </Link>
      </div>
    </section>
  );
}

/**
 * Dòng thời gian cuộn ngang. Trên màn hình lớn, khung được ghim và cuộn dọc trang sẽ kéo trục đi ngang
 * từ Brahmi đến chữ Thái hiện đại; các nhánh rẽ sang hệ chữ khác hiện màu xám phía trên trục.
 * Màn hình nhỏ hoặc tắt chuyển động thì là vùng vuốt ngang bình thường.
 */
export function ScriptTimeline() {
  const t = useT();
  const { locale } = useLocale();
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pinned = useRef(false);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(-1);

  /** Vị trí ngang hiện tại của đường ray, bất kể đang ghim hay đang vuốt. */
  const offset = useCallback(() => (pinned.current ? -Number(gsap.getProperty(track.current!, "x")) : stage.current!.scrollLeft), []);
  const distance = useCallback(() => track.current!.scrollWidth - stage.current!.clientWidth, []);

  const sync = useCallback(() => {
    if (!track.current || !stage.current) return;
    const x = offset();
    const probe = x + stage.current.clientWidth * 0.35;
    let idx = -1;
    track.current.querySelectorAll<HTMLElement>(".tl-era").forEach((c, i) => {
      if (c.offsetLeft <= probe) idx = i;
    });
    setActive(idx);
    const d = distance();
    if (progress.current) progress.current.style.transform = `scaleX(${d > 0 ? Math.min(1, Math.max(0, x / d)) : 0})`;
  }, [offset, distance]);

  useEffect(() => {
    const el = stage.current!;
    el.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => el.removeEventListener("scroll", sync);
  }, [sync]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PINNED_QUERY, () => {
        pinned.current = true;
        const box = wrap.current!;
        const sc = stage.current!;
        const el = track.current!;
        gsap.set(sc, { overflowX: "hidden" });

        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          onUpdate: sync,
          scrollTrigger: { trigger: box, start: "top top+=56", end: () => `+=${distance()}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
        });
        trigger.current = slide.scrollTrigger ?? null;

        const at = (trg: Element, start: string, end?: string) =>
          end ? { trigger: trg, containerAnimation: slide, start, end, scrub: true } : { trigger: trg, containerAnimation: slide, start, toggleActions: "play none none reverse" };

        gsap.utils.toArray<HTMLElement>(".tl-intro", el).forEach((n) => {
          gsap.to(n, { yPercent: -8, opacity: 0.2, ease: "none", scrollTrigger: at(n, "left 5%", "right 0%") });
        });

        gsap.utils.toArray<HTMLElement>(".tl-era", el).forEach((col) => {
          gsap.fromTo(col.querySelector(".tl-fill"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: at(col, "left 62%", "right 62%") });
          gsap.fromTo(col.querySelector(".tl-node-on"), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)", scrollTrigger: at(col, "left 66%") });
          gsap.fromTo(col.querySelector(".tl-card"), { y: 50, opacity: 0, rotate: 1.5 }, { y: 0, opacity: 1, rotate: 0, ease: "none", scrollTrigger: at(col, "left 100%", "left 55%") });
          gsap.fromTo(col.querySelector(".tl-year"), { xPercent: 18 }, { xPercent: -18, ease: "none", scrollTrigger: at(col, "left 100%", "right 0%") });
          const branches = col.querySelectorAll(".tl-branch");
          if (branches.length) gsap.fromTo(branches, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out", scrollTrigger: at(col, "left 80%") });
        });

        return () => {
          pinned.current = false;
          trigger.current = null;
        };
      });
    },
    { scope: wrap },
  );

  /** Nhảy tới một chặng: kéo thanh cuộn của trang khi đang ghim, hoặc cuộn ngang vùng vuốt. */
  const jump = (i: number) => {
    const col = track.current!.querySelectorAll<HTMLElement>(".tl-era")[i];
    if (!col) return;
    const st = trigger.current;
    if (pinned.current && st) {
      const p = Math.min(1, Math.max(0, col.offsetLeft / distance()));
      window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "smooth" });
    } else {
      stage.current!.scrollTo({ left: col.offsetLeft, behavior: "smooth" });
    }
  };

  return (
    <div ref={wrap} className="relative flex flex-col bg-paper tall:h-[calc(100svh-3.5rem)]" role="region" aria-label={t.history.timelineAria}>
      <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-ink/10" aria-hidden>
        <div ref={progress} className="h-full origin-left scale-x-0" style={{ background: "linear-gradient(90deg, var(--color-tone-high), var(--color-high), var(--color-tone-falling), var(--color-mid))" }} />
      </div>

      <div ref={stage} className="min-h-0 flex-1 snap-x snap-proximity scroll-pl-4 overflow-x-auto overflow-y-hidden overscroll-x-contain">
        <div ref={track} className="relative flex h-full w-max gap-4 px-4 tall:gap-0 tall:px-0 will-change-transform">
          <IntroPanel />
          {SCRIPT_ERAS.map((era, i) => (
            <EraColumn key={era.id} era={era} index={i} last={i === SCRIPT_ERAS.length - 1} />
          ))}
          <EndPanel />
        </div>
      </div>

      <nav aria-label={t.history.timelineNavAria} className="shrink-0 border-t border-ink/15 bg-paper-deep/60 px-3 py-2">
        <ol className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto">
          {SCRIPT_ERAS.map((era, i) => (
            <li key={era.id} className="min-w-0 flex-1 basis-0">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-label={fmt(t.history.jumpTo, { name: era.name[locale] })}
                aria-current={active === i ? "step" : undefined}
                className={cn(
                  "flex w-full min-w-[4.5rem] flex-col items-center rounded-xl px-2 py-1.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-ink",
                  active === i ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
                )}
              >
                <span className="text-xs font-semibold leading-tight">{era.year[locale]}</span>
                <span className="hidden w-full truncate text-[11px] leading-tight sm:block">{era.name[locale]}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
