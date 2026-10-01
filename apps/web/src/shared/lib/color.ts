/** Pha màu (thường là CSS var) với trong suốt – chạy được ở cả theme sáng và tối. */
/** Màu chữ đặt trên nền `tint` của chính nó: ngả về màu chữ chính để đủ tương phản ở mọi giao diện. */
export const onTint = (color: string) => `color-mix(in oklab, ${color} 65%, var(--color-ink))`;

export const tint = (color: string, percent: number) => `color-mix(in oklab, ${color} ${percent}%, transparent)`;

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Tỷ lệ tương phản WCAG 2.x giữa hai màu #rrggbb (1 đến 21). */
export const contrastRatio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Trộn `fg` lên `bg` với độ đậm `alpha` (xấp xỉ trong sRGB). */
export const mixHex = (fg: string, bg: string, alpha: number) =>
  "#" +
  channels(fg)
    .map((v, i) => Math.round(v * alpha + channels(bg)[i] * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("");

/** Ngưỡng WCAG AA cho chữ thường. */
export const AA_CONTRAST = 4.5;
