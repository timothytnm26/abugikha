"use client";
import { useId, type CSSProperties, type ReactNode } from "react";
import type { SyllableAnalysis } from "@/entities/syllable";
import type { PartKind } from "@/features/build-syllable";
import { useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";

/** Dấu nằm trên / dưới chữ (không chiếm chỗ theo chiều ngang) */
const ABOVE = /[ัิ-ื็ํ]/u;
const BELOW = /[ุ-ฺ]/u;

/** Tầng/ô mà mảnh đầu tiên của nguyên âm rơi vào (đích khi kéo thả) */
export function vowelCell(pattern: string): "before" | "above" | "below" | "after" {
  const [head, tail = ""] = pattern.split("C");
  if (head) return "before";
  const first = tail[0] ?? "";
  return ABOVE.test(first) ? "above" : BELOW.test(first) ? "below" : "after";
}

export type Cell = "tone" | "above" | "before" | "cons" | "after" | "final" | "below";

export interface NotebookLayout {
  tone: string;
  above: string;
  before: string;
  cons: string;
  after: string;
  final: string;
  below: string;
}

/** Tách âm tiết (đã đúng thứ tự Unicode) thành các mảnh theo vị trí trong vở 4 tầng. */
export function layoutOf(a: SyllableAnalysis): NotebookLayout {
  const out: NotebookLayout = { tone: "", above: "", before: "", cons: "", after: "", final: "", below: "" };
  let seenInitial = false;
  for (const seg of a.segments) {
    if (seg.role === "initial") {
      out.cons = seg.text;
      seenInitial = true;
    } else if (seg.role === "mark") out.tone += seg.text;
    else if (seg.role === "final") out.final = seg.text;
    else if (!seenInitial) out.before += seg.text;
    else
      for (const ch of seg.text) {
        if (ABOVE.test(ch)) out.above += ch;
        else if (BELOW.test(ch)) out.below += ch;
        else out.after += ch;
      }
  }
  return out;
}

/**
 * Hiện riêng một dấu trên/dưới: vẽ "◌ + dấu" để dấu bám đúng chỗ như khi viết thật,
 * rồi cắt khung chỉ giữ phần dấu. Dùng SVG vì y = 0 luôn là đường cơ sở, không phụ thuộc
 * line-height. Số đo theo Noto Serif Thai (em, từ đường cơ sở): ◌ cao tới 0.54,
 * dấu trên/dấu thanh 0.60–0.88, dấu dưới −0.04 đến −0.30.
 */
const MARK_VIEWBOX = { top: "0 -0.94 0.8 0.38", bottom: "0 0.01 0.8 0.34" };

function MarkGlyph({ chars, where }: { chars: string; where: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden
      viewBox={MARK_VIEWBOX[where]}
      className="block h-[0.46em] w-auto overflow-hidden"
    >
      <text lang="th" x="0.4" y="0" fontSize="1" textAnchor="middle" fill="currentColor" className="font-thai">
        ◌{chars}
      </text>
    </svg>
  );
}

interface CellProps {
  cell: Cell;
  part: PartKind;
  slot: string;
  text: string;
  color?: string;
  label?: string;
  popover?: (id: string) => ReactNode;
  align?: "start" | "center" | "end";
  onSelect: () => void;
  onClear?: () => void;
  clearLabel?: string;
  ariaLabel: string;
  multi?: boolean;
}

/** Hướng mảnh bay vào ô khi vừa được chọn (đơn vị: cỡ chữ vở) */
export const FLY_FROM: Record<Cell, [number, number]> = {
  before: [-1.1, 0],
  after: [1.1, 0],
  final: [1.3, 0],
  above: [0, -0.9],
  tone: [0, -1],
  below: [0, 0.9],
  cons: [0, 0],
};

function NotebookCell({ cell, part, slot, text, color, label, popover, onSelect, onClear, clearLabel, ariaLabel, multi }: CellProps) {
  const main = cell === "before" || cell === "cons" || cell === "after" || cell === "final";
  const empty = !text;
  const popId = useId();
  return (
    <div
      className={cn(
        "group/step relative flex",
        main ? "items-stretch" : "items-center",
        // Dấu của cụm phụ âm (หน, กร) gắn vào chữ cuối nên canh phải
        !main && (multi ? "justify-end pr-[0.12em]" : "justify-center"),
        main && "justify-center",
      )}
      style={{ gridArea: cell }}
    >
      <button
        type="button"
        data-slot={slot}
        data-part={part}
        data-cell={cell}
        onClick={onSelect}
        aria-label={ariaLabel}
        aria-describedby={popover ? popId : undefined}
        className={cn(
          "relative grid place-items-center rounded-[0.14em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          main ? "min-w-[0.95em] px-[0.06em]" : "min-h-[0.62em] min-w-[0.7em]",
          cell === "cons" && "min-w-[1.15em]",
          main && empty && "border-[1.5px] border-dashed border-ink/55",
          !main && empty && "opacity-0 focus-visible:opacity-100",
        )}
        style={color && !empty ? ({ color } as CSSProperties) : undefined}
      >
        {!empty &&
          (main ? (
            <span lang="th" data-piece className="font-thai leading-none">
              {text}
            </span>
          ) : (
            <span data-piece>
              <MarkGlyph chars={text} where={cell === "below" ? "bottom" : "top"} />
            </span>
          ))}
        {main && empty && label && (
          <span className="absolute inset-x-0 bottom-[0.08em] text-center font-sans text-[max(9px,0.13em)] font-semibold uppercase tracking-wider text-ink-soft">
            {label}
          </span>
        )}
      </button>
      {onClear && !empty && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="absolute -right-1.5 -top-1.5 z-10 grid size-5 place-items-center rounded-full bg-ink font-sans text-xs leading-none text-paper before:absolute before:-inset-3.5 before:content-[''] hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          ×
        </button>
      )}
      {popover?.(popId)}
    </div>
  );
}

export interface NotebookProps {
  analysis: SyllableAnalysis;
  classColor: string;
  toneColor: string;
  /** Liveness badge ở tầng dưới, cột âm cuối */
  liveLabel: string;
  multiInitial: boolean;
  onSelect: (kind: PartKind) => void;
  onClear: (kind: "final" | "mark") => void;
  clearLabel: (kind: "final" | "mark") => string;
  popovers: Record<PartKind, (align: "start" | "center" | "end", id: string) => ReactNode>;
  labels: Record<PartKind, string>;
}

/** Vở tập viết 4 tầng: dấu thanh / nguyên âm trên / dòng chính / nguyên âm dưới. */
export function Notebook({
  analysis: a,
  classColor,
  toneColor,
  liveLabel,
  multiInitial,
  onSelect,
  onClear,
  clearLabel,
  popovers,
  labels,
}: NotebookProps) {
  const t = useT();
  const L = layoutOf(a);
  const tiers = t.notebook.tiers;
  const bands: [keyof typeof tiers, string][] = [
    ["tone", "text-[color:var(--tone-accent)]"],
    ["above", ""],
    ["main", ""],
    ["below", ""],
  ];
  const vowelProps = (cell: Cell, align: "start" | "center" | "end") => ({
    part: "vowel" as const,
    slot: `vowel-${cell}`,
    onSelect: () => onSelect("vowel"),
    ariaLabel: `${labels.vowel}: ${L[cell as keyof NotebookLayout] || "—"}`,
    popover: (id: string) => popovers.vowel(align, id),
  });

  return (
    <div
      data-scale
      className="note-paper relative overflow-hidden rounded-xl text-[clamp(44px,8vw,68px)] xl:text-[clamp(52px,11vw,84px)]"
      style={{ "--tone-accent": toneColor } as CSSProperties}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0,1fr) auto auto auto auto minmax(0,1fr)",
          gridTemplateRows: "0.62em 0.62em 1.34em 0.58em",
          gridTemplateAreas: `". . tone . . ." ". . above . . ." ". before cons after final ." ". . below . liveness ."`,
          columnGap: "0.1em",
        }}
      >
        {/* Các tầng kẻ ngang của vở */}
        {bands.map(([k, cls], i) => (
          <div
            key={k}
            aria-hidden
            className={cn(
              "paper-tier pointer-events-none border-ink/20 font-sans",
              k === "main" ? "border-y-[1.5px] bg-paper-deep/60" : i > 0 && "border-t border-dashed",
            )}
            style={{ gridColumn: "1 / -1", gridRow: i + 1 }}
          >
            <span className={cn("ml-3 mt-1.5 hidden text-[10px] font-semibold uppercase tracking-widest text-ink-soft sm:block", cls)}>
              {tiers[k]}
            </span>
          </div>
        ))}

        <NotebookCell
          cell="tone"
          part="mark"
          slot="mark"
          text={L.tone}
          color={toneColor}
          multi={multiInitial}
          ariaLabel={`${labels.mark}: ${L.tone || "—"}`}
          onSelect={() => onSelect("mark")}
          onClear={() => onClear("mark")}
          clearLabel={clearLabel("mark")}
          popover={(id) => popovers.mark("center", id)}
        />
        <NotebookCell cell="above" text={L.above} multi={multiInitial} {...vowelProps("above", "center")} />
        <NotebookCell cell="before" text={L.before} label={t.notebook.cells.before} {...vowelProps("before", "start")} />
        <NotebookCell
          cell="cons"
          part="initial"
          slot="initial"
          text={L.cons}
          color={classColor}
          label={t.notebook.cells.cons}
          ariaLabel={`${labels.initial}: ${L.cons}`}
          onSelect={() => onSelect("initial")}
          popover={(id) => popovers.initial("start", id)}
        />
        <NotebookCell cell="after" text={L.after} label={t.notebook.cells.after} {...vowelProps("after", "center")} />
        <NotebookCell
          cell="final"
          part="final"
          slot="final"
          text={L.final}
          label={t.notebook.cells.final}
          ariaLabel={`${labels.final}: ${L.final || "—"}`}
          onSelect={() => onSelect("final")}
          onClear={() => onClear("final")}
          clearLabel={clearLabel("final")}
          popover={(id) => popovers.final("end", id)}
        />
        <NotebookCell cell="below" text={L.below} multi={multiInitial} {...vowelProps("below", "center")} />
        <div className="grid place-items-center" style={{ gridArea: "liveness" }}>
          <span className="rounded-full bg-paper-deep px-2 py-0.5 font-sans text-[11px] font-medium text-ink-soft">{liveLabel}</span>
        </div>
      </div>
    </div>
  );
}
