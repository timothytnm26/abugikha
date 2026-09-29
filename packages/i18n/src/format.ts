export type Params = Record<string, string | number>;

const FILTERS: Record<string, (s: string) => string> = {
  lower: (s) => s.toLowerCase(),
  upper: (s) => s.toUpperCase(),
};

/** Chèn tham số vào chuỗi mẫu: fmt("Bước {n} / {total}", { n: 1, total: 5 }). Hỗ trợ `{x|lower}`, `{x|upper}`. */
export function fmt(template: string, params: Params): string {
  return template.replace(/\{(\w+)(?:\|(\w+))?\}/g, (raw, key: string, filter?: string) => {
    const value = params[key];
    if (value === undefined) return raw;
    const s = String(value);
    return filter && FILTERS[filter] ? FILTERS[filter](s) : s;
  });
}
