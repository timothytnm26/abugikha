/** Chữ trôi lơ lửng phía sau toàn trang chủ (trải từ phần mở đầu xuống các phần sau) để các phần nối liền nhau; chỉ để trang trí. */
const FLOATERS = [
  { ch: 'ก', pos: 'left-[49%]', top: '26svh', size: 'text-8xl text-mid', d: '0s' },
  { ch: '๑', pos: 'left-[44%]', top: '6svh', size: 'text-6xl text-tone-high', d: '1.2s' },
  { ch: 'ข', pos: 'right-[3%]', top: '10svh', size: 'text-8xl text-high', d: '1.8s' },
  { ch: 'เ', pos: 'right-[24%]', top: '78svh', size: 'text-7xl text-part-vowel', d: '0.3s' },
  { ch: 'ม', pos: 'right-[8%]', top: '68svh', size: 'text-7xl text-low', d: '2.1s' },
  { ch: '◌้', pos: 'left-[47%]', top: '64svh', size: 'text-7xl text-tone-falling', d: '0.9s' },
  { ch: 'ง', pos: 'right-[30%]', top: '5svh', size: 'text-5xl text-part-final', d: '1.5s' },
  // đoạn kéo dài xuống phần giới thiệu âm tiết và các phần sau
  { ch: 'ท', pos: 'left-[4%]', top: '112svh', size: 'text-8xl text-low', d: '0.6s' },
  { ch: '๒', pos: 'right-[6%]', top: '128svh', size: 'text-6xl text-tone-rising', d: '1.4s' },
  { ch: 'า', pos: 'left-[52%]', top: '150svh', size: 'text-7xl text-part-vowel', d: '2s' },
  { ch: 'ด', pos: 'left-[8%]', top: '176svh', size: 'text-7xl text-mid', d: '0.2s' },
  { ch: '◌่', pos: 'right-[10%]', top: '196svh', size: 'text-7xl text-tone-high', d: '1s' },
  { ch: 'ร', pos: 'left-[6%]', top: '262svh', size: 'text-8xl text-low', d: '1.7s' },
  { ch: 'ส', pos: 'right-[7%]', top: '284svh', size: 'text-7xl text-high', d: '0.8s' },
];

export function FloatingGlyphs() {
  return (
    <div lang="th" aria-hidden className="pointer-events-none absolute inset-0 select-none font-thai opacity-[0.14]">
      {FLOATERS.map((f) => (
        <span key={f.ch} className={`absolute ${f.pos} ${f.size} [animation:drift-slow_7s_ease-in-out_infinite]`} style={{ top: f.top, animationDelay: f.d }}>
          {f.ch}
        </span>
      ))}
    </div>
  );
}
