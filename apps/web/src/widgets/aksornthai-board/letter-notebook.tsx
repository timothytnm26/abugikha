"use client";
import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";
import { THAI_SPECIMEN_CSS, THAI_SPECIMEN_FONTS, type ThaiFontStyle } from "@/shared/config/fonts";
import { useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";

/**
 * Đường kẻ của vở 4 tầng, tính theo em từ đường cơ sở (y âm = phía trên), đo trên Noto Serif Thai:
 * thân chữ / ◌ cao 0.54–0.56, nguyên âm trên tới 0.88, đuôi ป ฝ ฟ tới 0.77, dấu thanh chồng
 * trên nguyên âm tới 1.07; nguyên âm dưới xuống −0.30, đuôi ฎ ฏ ฐ xuống −0.25…−0.27.
 * Chữ được viết liền một khối trên đường cơ sở nên font tự đặt dấu và đuôi chữ đúng tầng;
 * font khác có thân chữ cao/thấp khác nên thấy rõ chữ thay đổi thế nào so với cùng một khung kẻ.
 */
const TIERS = [
  { key: "tone", top: -1.14, bottom: -0.9 },
  { key: "above", top: -0.9, bottom: -0.58 },
  { key: "main", top: -0.58, bottom: 0 },
  { key: "below", top: 0, bottom: 0.34 },
] as const;
/**
 * Khung dọc cố định, đủ chứa phần mực của mọi chữ trên trang ở cả 4 font (đo sẵn bằng canvas
 * `actualBoundingBox*`, 100px, Chrome): cao nhất โ◌ะ của Charm (1.42em), sâu nhất ◌ุ của Charm (0.49em).
 * Cố định để các vạch kẻ không nhảy khi đổi chữ và không phụ thuộc lúc font tải xong. Đổi font → đo lại.
 */
const FRAME_TOP = -1.48;
const FRAME_BOTTOM = 0.55;
const FRAME_H = FRAME_BOTTOM - FRAME_TOP;
const PAD = 0.18;
/**
 * Dấu thanh đứng một mình (◌่ ◌้ ◌๊ ◌๋): font hạ dấu xuống sát phụ âm (tầng nguyên âm trên); trong vở tập viết
 * dấu thanh nằm ở tầng trên cùng. Khoảng nâng (em) để tâm dấu ở giữa tầng dấu thanh, đo sẵn theo từng font.
 */
const LONE_TONE = /^◌[\u0E48-\u0E4B]$/u;
const TONE_LIFT: Record<string, Record<string, number>> = {
  "Noto Sans Thai Looped": { "\u0E48": 0.26, "\u0E49": 0.25, "\u0E4A": 0.255, "\u0E4B": 0.265 },
  Kanit: { "\u0E48": 0.315, "\u0E49": 0.315, "\u0E4A": 0.305, "\u0E4B": 0.31 },
  Charm: { "\u0E48": 0.21, "\u0E49": 0.1, "\u0E4A": 0.09, "\u0E4B": 0.22 },
  Sriracha: { "\u0E48": 0.255, "\u0E49": 0.275, "\u0E4A": 0.285, "\u0E4B": 0.24 },
};
const DEFAULT_LIFT = 0.26;

/** Khung vuông chung cho cả 4 ô: cao cố định, rộng thêm khi chữ rộng (vd. เ◌ียะ) */
interface Frame {
  size: number;
  top: number;
}

function Specimen({ family, text, frame, onMeasure }: { family: string; text: string; frame: Frame; onMeasure: (family: string, width: number) => void }) {
  const ref = useRef<SVGTextElement | null>(null);
  const lone = LONE_TONE.test(text);
  const lift = lone ? (TONE_LIFT[family]?.[text.slice(1)] ?? DEFAULT_LIFT) : 0;

  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      if (alive && ref.current) onMeasure(family, ref.current.getComputedTextLength());
    };
    measure();
    // Font tải sau (Google Fonts) thì bề rộng đổi: đo lại khi font này hoặc bất kỳ font nào tải xong
    void document.fonts?.load(`1em "${family}"`, text).then(measure, measure);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      alive = false;
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [family, text, onMeasure]);

  const { size, top } = frame;
  // ◌ chỉ là chỗ giữ phụ âm nên tô nhạt; vẫn cùng một khối <text> để font ghép dấu đúng vị trí
  const parts = text.split(/(◌)/).filter(Boolean);
  const textProps = { x: size / 2, y: 0, fontSize: 1, textAnchor: "middle" as const, style: { fontFamily: `"${family}"` } };
  return (
    <svg aria-hidden viewBox={`0 ${top} ${size} ${size}`} className="block aspect-square w-full overflow-hidden">
      <rect x="0" y={TIERS[2].top} width={size} height={-TIERS[2].top} className="fill-paper-deep/60" />
      {TIERS.slice(1).map((tier) => (
        <line
          key={tier.key}
          x1="0"
          x2={size}
          y1={tier.top}
          y2={tier.top}
          vectorEffect="non-scaling-stroke"
          strokeWidth={tier.key === "above" ? 1 : 1.5}
          strokeDasharray={tier.key === "above" ? "4 3" : undefined}
          className="stroke-ink/20"
        />
      ))}
      {lone ? (
        <>
          {/* ◌ tại chỗ; lớp thứ hai là cả cụm (◌ trong suốt) dịch lên để dấu vào tầng dấu thanh mà vẫn giữ vị trí ngang của font */}
          <text ref={ref} {...textProps} className="fill-ink/30">
            ◌
          </text>
          <text {...textProps} transform={`translate(0 ${-lift})`} className="fill-ink">
            <tspan className="fill-transparent">◌</tspan>
            {text.slice(1)}
          </text>
        </>
      ) : (
        <text ref={ref} {...textProps} className="fill-ink">
          {parts.map((p, i) => (
            <tspan key={i} className={p === "◌" ? "fill-ink/30" : undefined}>
              {p}
            </tspan>
          ))}
        </text>
      )}
    </svg>
  );
}

/** Lề giấy kèm tên tầng, cùng khung với các ô bên cạnh nên vạch kẻ khớp nhau */
function Margin({ frame }: { frame: Frame }) {
  const t = useT();
  const at = (y: number) => `${((y - frame.top) / frame.size) * 100}%`;
  return (
    <div aria-hidden className="relative border-r-2 border-margin">
      {TIERS.map((tier, i) => (
        <div
          key={tier.key}
          className={cn(
            "absolute inset-x-0 overflow-hidden whitespace-nowrap border-ink/20 px-2 pt-0.5 text-[10px] font-semibold leading-tight text-ink-soft",
            tier.key === "main" ? "border-y-[1.5px] bg-paper-deep/60" : i === 1 && "border-t border-dashed",
          )}
          style={{ top: at(tier.top), height: `${((tier.bottom - tier.top) / frame.size) * 100}%` }}
        >
          <span className="hidden sm:inline" title={t.notebook.tiers[tier.key]}>
            {t.notebook.tiersShort[tier.key]}
          </span>
        </div>
      ))}
    </div>
  );
}

function Caption({ family, style }: { family: string; style: ThaiFontStyle }) {
  const t = useT();
  return (
    <p className="h-full border-y border-ink/10 px-2 py-1 text-center leading-tight">
      <span className="block text-balance text-[11px] font-medium">{family}</span>
      <span className="block text-[10px] text-ink-soft">{t.aksornthai.fontStyles[style]}</span>
    </p>
  );
}

const ROWS = [THAI_SPECIMEN_FONTS.slice(0, 2), THAI_SPECIMEN_FONTS.slice(2, 4)];

/** Vở 4 tầng dạng lưới 2 × 2: cùng một chữ ở 4 font, mỗi ô vuông cùng tỉ lệ để so sánh. */
export function LetterNotebook({ text }: { text: string }) {
  const t = useT();
  // Đổi tên state (trước là số đo mực) để Fast Refresh không giữ lại giá trị kiểu cũ
  const [textWidths, setTextWidths] = useState<Record<string, number>>({});
  const onMeasure = useCallback((family: string, w: number) => setTextWidths((p) => (p[family] === w ? p : { ...p, [family]: w })), []);
  const size = Math.max(FRAME_H, Math.max(0, ...Object.values(textWidths)) + 2 * PAD);
  const frame: Frame = { size, top: FRAME_TOP - (size - FRAME_H) / 2 };

  return (
    <figure>
      {/* React 19 đưa stylesheet lên <head>; chỉ trang này cần các font so sánh */}
      <link rel="stylesheet" href={THAI_SPECIMEN_CSS} precedence="default" />
      <div className="grid grid-cols-[1rem_minmax(0,1fr)_minmax(0,1fr)] overflow-hidden rounded-xl border border-ink/10 bg-paper sm:grid-cols-[4.25rem_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[3.75rem_minmax(0,1fr)_minmax(0,1fr)]">
        {ROWS.map((row, r) => (
          <Fragment key={r}>
            <Margin frame={frame} />
            {row.map((f, i) => (
              <div key={f.family} className={cn(i > 0 && "border-l border-ink/10")}>
                <Specimen family={f.family} text={text} frame={frame} onMeasure={onMeasure} />
              </div>
            ))}
            <div aria-hidden className={cn("border-r-2 border-y border-r-margin border-y-ink/10", r === ROWS.length - 1 && "border-b-0")} />
            {row.map((f, i) => (
              <div key={f.family} className={cn(i > 0 && "border-l border-ink/10", r === ROWS.length - 1 && "[&>p]:border-b-0")}>
                <Caption family={f.family} style={f.style} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-soft">{t.aksornthai.practiceHint}</figcaption>
    </figure>
  );
}
