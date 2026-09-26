"use client";
import { useMemo, useRef, useState } from "react";
import { SCRIPT_EDGES, SCRIPT_NODES, lineageOf, type ScriptNode } from "@/entities/script-history";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";
import { useLocale, useT } from "@/shared/i18n";

const NODE_BY_ID = new Map(SCRIPT_NODES.map((n) => [n.id, n]));
const R = 40;

function edgePath(a: ScriptNode, b: ScriptNode) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
}

export function ScriptHistoryGraph() {
  const t = useT();
  const { locale } = useLocale();
  const [selId, setSelId] = useState("modern");
  const svg = useRef<SVGSVGElement>(null);
  const lineage = useMemo(() => lineageOf(selId), [selId]);
  const sel = NODE_BY_ID.get(selId)!;

  // Vẽ lần lượt các cạnh khi sơ đồ xuất hiện
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const paths = gsap.utils.toArray<SVGPathElement>(".edge");
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const tl = gsap.timeline();
      // Phóng to từng node quanh đúng tâm hình tròn (svgOrigin), không phải tâm bbox của cả nhóm chữ
      gsap.utils.toArray<SVGGElement>(".node").forEach((g, i) => {
        tl.from(g, { scale: 0, svgOrigin: `${g.dataset.cx} ${g.dataset.cy}`, duration: 0.4, ease: "back.out(2)" }, i * 0.07);
      });
      tl.to(paths, { strokeDashoffset: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }, 0.2)
        .set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
    },
    { scope: svg },
  );

  // Nhịp sáng dọc theo dòng dõi khi chọn node
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Đổi bán kính thay vì scale nên vòng sáng luôn đồng tâm với node
      gsap.fromTo(`[data-node="${selId}"] .halo`, { attr: { r: R }, opacity: 0.9, strokeWidth: 4 }, { attr: { r: R * 1.7 }, opacity: 0, strokeWidth: 1, duration: 0.8, ease: "power2.out" });
    },
    { scope: svg, dependencies: [selId] },
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
      <div className="overflow-x-auto rounded-3xl bg-paper-deep p-2">
        <svg ref={svg} viewBox="0 0 1000 640" className="min-w-[44rem]" role="group" aria-label={t.history.graphAria}>
          {SCRIPT_EDGES.map((e) => {
            const a = NODE_BY_ID.get(e.from)!;
            const b = NODE_BY_ID.get(e.to)!;
            const on = lineage.has(e.from) && lineage.has(e.to) && e.kind === "descent";
            return (
              <path
                key={`${e.from}-${e.to}`}
                className="edge"
                d={edgePath(a, b)}
                fill="none"
                stroke={on ? "var(--color-mid)" : "currentColor"}
                strokeOpacity={on ? 1 : 0.2}
                strokeWidth={on ? 5 : 2.5}
                strokeDasharray={e.kind === "influence" ? "6 8" : undefined}
                style={{ transition: "stroke 300ms, stroke-width 300ms, stroke-opacity 300ms" }}
              />
            );
          })}
          {SCRIPT_NODES.map((n) => {
            const on = lineage.has(n.id);
            const active = n.id === selId;
            return (
              <g
                key={n.id}
                data-node={n.id}
                data-cx={n.x}
                data-cy={n.y}
                className="node cursor-pointer outline-none [&:focus-visible_.disc]:stroke-ink [&:focus-visible_.disc]:stroke-[4]"
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={`${n.name[locale]}, ${n.period[locale]}`}
                onClick={() => setSelId(n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelId(n.id))}
              >
                <circle className="halo" cx={n.x} cy={n.y} r={R} fill="none" stroke="var(--color-mid)" strokeWidth={3} opacity={0} />
                <circle
                  className="disc"
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={active ? "var(--color-ink)" : on ? "var(--color-mid)" : "var(--color-paper)"}
                  stroke="currentColor"
                  strokeOpacity={on ? 0 : 0.2}
                  strokeWidth={2}
                  style={{ transition: "fill 300ms" }}
                />
                <text
                  x={n.x}
                  y={n.y + (n.ka ? 12 : 6)}
                  textAnchor="middle"
                  className={cn("pointer-events-none", n.ka ? `${n.kaFont} text-[34px]` : "text-[15px] font-semibold")}
                  fill={on ? "var(--color-paper)" : "var(--color-ink)"}
                >
                  {n.ka ?? n.name.en.slice(0, 2)}
                </text>
                <text x={n.x} y={n.y + R + 22} textAnchor="middle" className="pointer-events-none fill-ink text-[15px] font-semibold">{n.name[locale]}</text>
                <text x={n.x} y={n.y + R + 40} textAnchor="middle" className="pointer-events-none fill-ink-soft text-[12px]">{n.period[locale]}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex flex-wrap gap-5 px-4 pb-3 text-xs text-ink-soft">
          <span className="flex items-center gap-2"><span className="h-0.5 w-6 bg-ink/40" /> {t.history.legendDescent}</span>
          <span className="flex items-center gap-2"><span className="h-0 w-6 border-t-2 border-dashed border-ink/40" /> {t.history.legendInfluence}</span>
          <span>{t.history.legendKa}</span>
        </div>
      </div>

      <aside aria-live="polite" className="space-y-4">
        <div>
          <p className="text-sm text-ink-soft">{sel.region[locale]}</p>
          <h3 className="text-3xl font-semibold">{sel.name[locale]}</h3>
          <p className="text-ink-soft">{sel.period[locale]}</p>
        </div>
        <p className="leading-relaxed">{sel.summary[locale]}</p>
        <ul className="space-y-2">
          {sel.facts.map((f) => (
            <li key={f.en} className="rounded-2xl bg-paper-deep px-4 py-3 text-sm leading-relaxed">{f[locale]}</li>
          ))}
        </ul>
        <p className="text-sm text-ink-soft">
          {t.history.lineage}: {[...lineage].map((id) => NODE_BY_ID.get(id)!.name[locale]).reverse().join(" → ")}
        </p>
      </aside>
    </div>
  );
}
