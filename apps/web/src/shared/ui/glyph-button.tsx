import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/** Hai cỡ ô dùng chung: md cho bảng chữ (4.5rem), sm cho bộ chọn Ghép chữ (2.75rem). Chữ dài thì ô giãn ngang, chiều cao giữ nguyên. */
const SIZE = { md: 'h-18 min-w-18 px-3', sm: 'h-11 min-w-11 px-2' } as const;

interface GlyphButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed' | 'type'> {
  /** Cỡ ô; bỏ trống khi nội dung (InitialFace, VowelFace) tự quyết kích thước */
  size?: keyof typeof SIZE;
  /** Ô đang chọn; đồng thời là `aria-pressed` */
  active: boolean;
  /** Ký tự Thai đặt trong `<span lang="th">`; bỏ qua nếu truyền `children` (vd. InitialFace, VowelFace) */
  glyph?: ReactNode;
  /** Lớp riêng cho span ký tự (cỡ chữ, gạch ngang...) */
  glyphClassName?: string;
}

/**
 * Nút bấm chứa một ký tự (phụ âm, nguyên âm, dấu thanh, chữ số, âm cuối) dùng chung cho Bảng chữ, Ghép chữ...
 * Lo hành vi (type, aria-pressed, lang, font, viền focus) và cỡ ô. Màu do nơi dùng truyền qua
 * `className`/`style`; `cn` chỉ nối chuỗi nên đừng truyền lớp `outline-*` hay kích thước khác để chồng lên.
 */
export function GlyphButton({ active, size, glyph, glyphClassName, className, children, ...rest }: GlyphButtonProps) {
  return (
    <button type="button" aria-pressed={active} className={cn(size && SIZE[size], 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-25', className)} {...rest}>
      {children ?? (
        <span lang="th" className={cn('font-thai', glyphClassName)}>
          {glyph}
        </span>
      )}
    </button>
  );
}
