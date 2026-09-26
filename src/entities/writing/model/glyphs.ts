import data from "./strokes.json";

/**
 * Nét chữ theo đường tâm (centerline), trích từ font Noto Sans Thai Looped (SIL OFL 1.1):
 * render chữ → skeletonize → dựng đồ thị các đoạn nét → đi bút bắt đầu từ đầu tròn (หัว),
 * ưu tiên đi thẳng, gặp đầu cụt thì lùi lại trên nét cũ thay vì nhấc bút.
 * Toạ độ: 1000 đơn vị/em, gốc ở chân chữ, căn giữa theo chiều ngang.
 */
export interface GlyphData {
  /** Các nét bút theo thứ tự viết (thường chỉ 1 nét) */
  strokes: string[];
  /** Độ dày nét */
  width: number;
  /** Tâm đầu tròn, nếu chữ có */
  head: [number, number] | null;
}

export const GLYPH_META = data.meta as { y0: number; y1: number; maxW: number; xh: number };
export const GLYPHS = data.glyphs as unknown as Record<string, GlyphData>;
