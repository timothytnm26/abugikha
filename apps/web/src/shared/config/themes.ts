import { PREFS_STORAGE_KEY, type PaletteKey, type SurfaceKey, type ThemeVarKey } from './palette';

export type ThemeMode = 'light' | 'dark';
export type ThemeId = 'celadon' | 'sakura' | 'matcha' | 'sepia' | 'midnight' | 'twilight' | 'cocoa';

export interface ThemeDef {
  id: ThemeId;
  mode: ThemeMode;
  vars: Record<ThemeVarKey, string>;
}

/** Bảng màu thành phần âm tiết (phụ âm đầu, nguyên âm, âm cuối, thanh) của một giao diện. */
type Parts = Record<PaletteKey, string>;

const make = (id: ThemeId, mode: ThemeMode, surface: Record<SurfaceKey, string>, parts: Parts): ThemeDef => ({
  id,
  mode,
  vars: { ...parts, ...surface },
});

/**
 * Bảng giao diện có sẵn. Nền luôn ngả xám/kem thay vì trắng hoặc đen tuyền; độ tương phản chữ vẫn đủ đọc
 * nhưng không chói, để học lâu không mỏi mắt. Mỗi giao diện tự chọn đủ 10 màu thành phần (3 nhóm phụ âm,
 * nguyên âm, âm cuối, 5 thanh) sao cho hợp nền và vẫn tách được nhau. Tên hiển thị: ui.settings.themes.<id>.
 */
export const THEMES: ThemeDef[] = [
  make(
    'celadon',
    'light',
    {
      paper: '#eef1ec',
      'paper-deep': '#e1e8e1',
      ink: '#1e2833',
      'ink-soft': '#58646f',
      'on-accent': '#ffffff',
      sheet: '#fbfbf4',
      'sheet-line': '#b9c9c9',
      margin: '#d98a86',
    },
    {
      mid: '#007a5b',
      high: '#a23e2d',
      low: '#215da5',
      'part-vowel': '#7c4a98',
      'part-final': '#507308',
      'tone-mid': '#616c67',
      'tone-low': '#474c95',
      'tone-falling': '#a3416d',
      'tone-high': '#965f00',
      'tone-rising': '#007498',
    },
  ),
  make(
    'sakura',
    'light',
    {
      paper: '#f6eeeb',
      'paper-deep': '#eddfdb',
      ink: '#3a2c32',
      'ink-soft': '#6d5c64',
      'on-accent': '#ffffff',
      sheet: '#fffaf6',
      'sheet-line': '#e3c4c4',
      margin: '#d98a86',
    },
    {
      mid: '#007944',
      high: '#a43944',
      low: '#0064a1',
      'part-vowel': '#6e4ea5',
      'part-final': '#666d00',
      'tone-mid': '#726567',
      'tone-low': '#325198',
      'tone-falling': '#9c4281',
      'tone-high': '#a55800',
      'tone-rising': '#007589',
    },
  ),
  make(
    'matcha',
    'light',
    {
      paper: '#ecefe1',
      'paper-deep': '#dfe5d0',
      ink: '#262f1f',
      'ink-soft': '#5a634d',
      'on-accent': '#ffffff',
      sheet: '#f9faee',
      'sheet-line': '#c2cfa8',
      margin: '#d5968a',
    },
    {
      mid: '#007268',
      high: '#954110',
      low: '#3d529a',
      'part-vowel': '#7f4281',
      'part-final': '#32712d',
      'tone-mid': '#62655c',
      'tone-low': '#524285',
      'tone-falling': '#9d3f54',
      'tone-high': '#836500',
      'tone-rising': '#0071a1',
    },
  ),
  make(
    'sepia',
    'light',
    {
      paper: '#f0e8d6',
      'paper-deep': '#e5dbc3',
      ink: '#3b3226',
      'ink-soft': '#665b4a',
      'on-accent': '#fffdf7',
      sheet: '#fbf4e2',
      'sheet-line': '#d6c7a2',
      margin: '#cf8f80',
    },
    {
      mid: '#006c5d',
      high: '#8b432a',
      low: '#37538c',
      'part-vowel': '#73477d',
      'part-final': '#426a2e',
      'tone-mid': '#646059',
      'tone-low': '#49447c',
      'tone-falling': '#90445b',
      'tone-high': '#846404',
      'tone-rising': '#166f92',
    },
  ),
  // default dark themes
  make(
    'midnight',
    'dark',
    {
      paper: '#121a1d',
      'paper-deep': '#1b262a',
      ink: '#e3ebe6',
      'ink-soft': '#9aaaa2',
      'on-accent': '#0f1518',
      sheet: '#1f2b2f',
      'sheet-line': '#3a4c52',
      margin: '#8e4f4c',
    },
    {
      mid: '#56d0af',
      high: '#fd9884',
      low: '#7cb4fc',
      'part-vowel': '#d1a1ef',
      'part-final': '#a4c973',
      'tone-mid': '#b4c1be',
      'tone-low': '#9ba4ee',
      'tone-falling': '#fd9bc2',
      'tone-high': '#f8c065',
      'tone-rising': '#67d8fc',
    },
  ),
  make(
    'twilight',
    'dark',
    {
      paper: '#1a1929',
      'paper-deep': '#252438',
      ink: '#e6e3f0',
      'ink-soft': '#a5a2bc',
      'on-accent': '#14131f',
      sheet: '#2a2940',
      'sheet-line': '#45435f',
      margin: '#8c5670',
    },
    {
      mid: '#5ad69b',
      high: '#ff9193',
      low: '#59bdff',
      'part-vowel': '#c9a5ff',
      'part-final': '#b9c956',
      'tone-mid': '#c0bfcb',
      'tone-low': '#85a8fb',
      'tone-falling': '#ff99da',
      'tone-high': '#ffb95b',
      'tone-rising': '#3de2fa',
    },
  ),
  make(
    'cocoa',
    'dark',
    {
      paper: '#211a17',
      'paper-deep': '#2c2320',
      ink: '#efe4dc',
      'ink-soft': '#b1a096',
      'on-accent': '#1a1310',
      sheet: '#33292a',
      'sheet-line': '#54444a',
      margin: '#94534d',
    },
    {
      mid: '#4ecfc0',
      high: '#f89d76',
      low: '#90affb',
      'part-vowel': '#dc9ee1',
      'part-final': '#92cd86',
      'tone-mid': '#c6bbb6',
      'tone-low': '#ada3eb',
      'tone-falling': '#ff9cb0',
      'tone-high': '#e9c768',
      'tone-rising': '#7ad3ff',
    },
  ),
];

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
export const DEFAULT_THEME: Record<ThemeMode, ThemeId> = { light: 'celadon', dark: 'midnight' };

/** Script chạy trong <head> trước khi vẽ trang: áp giao diện, màu và kiểu giấy đã lưu để không bị nháy. */
export const THEME_BOOT_SCRIPT = `try{var T=${JSON.stringify(Object.fromEntries(THEMES.map((t) => [t.id, { mode: t.mode, vars: t.vars }])))};var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state||{};var d=document.documentElement;var th=T[s.themeId];d.dataset.paper=s.paper||"tiers";if(th){d.dataset.theme=th.mode;var o=(s.palette&&s.palette[s.themeId])||{};for(var k in th.vars)d.style.setProperty("--color-"+k,o[k]||th.vars[k])}else d.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}`;
