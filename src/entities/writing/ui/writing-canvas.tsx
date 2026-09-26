"use client";
import { useRef } from "react";
import { GLYPHS, GLYPH_META } from "../model/glyphs";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";

interface Props {
  char: string;
  color: string;
  /** 1 = bình thường, 0.5 = chậm */
  speed?: number;
  /** Tăng để phát lại */
  replay?: number;
  className?: string;
}

const PAD = 80;

/** Mô phỏng viết chữ: đầu bút đi theo đường tâm nét, bắt đầu từ đầu tròn. */
export function WritingCanvas({ char, color, speed = 1, replay = 0, className }: Props) {
  const g = GLYPHS[char];
  const svg = useRef<SVGSVGElement>(null);
  const w = GLYPH_META.maxW + PAD * 2;
  const top = GLYPH_META.y0 - PAD;
  const h = GLYPH_META.y1 - GLYPH_META.y0 + PAD * 2;

  useGSAP(
    () => {
      const root = svg.current;
      if (!root || !g) return;
      const strokes = gsap.utils.toArray<SVGPathElement>(".ink", root);
      const pen = root.querySelector<SVGCircleElement>(".pen");
      const start = root.querySelector(".start");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: prefersReducedMotion() ? 0 : len });
      });
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline();
      gsap.set(pen, { opacity: 0 });
      if (start) tl.fromTo(start, { attr: { r: g.width * 0.4 }, opacity: 1 }, { attr: { r: g.width * 1.4 }, opacity: 0, duration: 0.45, repeat: 1, ease: "power2.out" });
      strokes.forEach((p, i) => {
        const len = p.getTotalLength();
        const state = { t: 0 };
        tl.to(
          state,
          {
            t: 1,
            duration: Math.max(0.4, len / 1400) / speed,
            ease: "power1.inOut",
            onStart: () => gsap.set(pen, { opacity: 1 }),
            onUpdate: () => {
              const at = p.getPointAtLength(state.t * len);
              p.style.strokeDashoffset = String(len * (1 - state.t));
              pen?.setAttribute("cx", String(at.x));
              pen?.setAttribute("cy", String(at.y));
            },
          },
          // nhấc bút giữa các nét: nghỉ một nhịp ngắn
          i === 0 ? ">" : ">+0.15",
        );
      });
      tl.to(pen, { opacity: 0, duration: 0.25 });
    },
    { scope: svg, dependencies: [char, replay, speed], revertOnUpdate: true },
  );

  if (!g) return null;
  return (
    <svg ref={svg} viewBox={`${-w / 2} ${top} ${w} ${h}`} className={className} role="img" aria-label={char}>
      {/* Dòng kẻ tập viết: chân chữ và đỉnh thân chữ */}
      <line x1={-w / 2} x2={w / 2} y1={0} y2={0} stroke="currentColor" strokeOpacity={0.18} strokeWidth={4} />
      <line x1={-w / 2} x2={w / 2} y1={GLYPH_META.xh} y2={GLYPH_META.xh} stroke="currentColor" strokeOpacity={0.12} strokeWidth={3} strokeDasharray="18 14" />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={g.width}>
        {/* Chữ mẫu mờ để tô theo */}
        {g.strokes.map((d, i) => <path key={`g${i}`} d={d} stroke="currentColor" strokeOpacity={0.07} />)}
        {g.strokes.map((d, i) => <path key={i} className="ink" d={d} stroke={color} />)}
      </g>
      {g.head && <circle className="start" cx={g.head[0]} cy={g.head[1]} r={g.width * 0.4} fill="none" stroke={color} strokeWidth={8} opacity={0} />}
      <circle className="pen" r={g.width * 0.32} fill="var(--color-paper)" stroke={color} strokeWidth={10} opacity={0} />
    </svg>
  );
}
