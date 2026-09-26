import type { L10n } from "@/shared/i18n";

export interface ScriptNode {
  id: string;
  name: L10n;
  period: L10n;
  region: L10n;
  ka?: string;
  kaFont?: string;
  summary: L10n;
  facts: L10n[];
  x: number;
  y: number;
}

export interface ScriptEdge {
  from: string;
  to: string;
  kind: "descent" | "influence";
}

const L = (vi: string, en: string): L10n => ({ vi, en });

/** Toạ độ trong viewBox 1000 × 640. Niên đại là ước lượng theo các nghiên cứu phổ biến. */
export const SCRIPT_NODES: ScriptNode[] = [
  {
    id: "brahmi", name: L("Brahmi", "Brahmi"), period: L("~thế kỷ 3 TCN", "~3rd c. BCE"), region: L("Ấn Độ", "India"), ka: "𑀓", kaFont: "font-brahmi",
    summary: L("Tổ tiên của gần như mọi hệ chữ ở Nam Á và Đông Nam Á, được biết đến rõ nhất qua các bia ký của vua Ashoka.", "Ancestor of nearly every script in South and Southeast Asia, best known from the edicts of Emperor Ashoka."),
    facts: [
      L("Là một abugida: mỗi phụ âm mặc định mang sẵn nguyên âm /a/.", "An abugida: every consonant carries an inherent /a/ vowel."),
      L("Nguyên âm khác được viết bằng dấu phụ gắn quanh phụ âm, đúng như chữ Thái ngày nay.", "Other vowels are written as marks around the consonant, just like Thai today."),
    ],
    x: 90, y: 300,
  },
  {
    id: "pallava", name: L("Pallava", "Pallava"), period: L("~thế kỷ 4–8", "~4th–8th c."), region: L("Nam Ấn", "South India"),
    summary: L("Biến thể Nam Ấn của Brahmi, theo chân thương nhân và tăng sĩ sang Đông Nam Á.", "A South Indian descendant of Brahmi, carried to Southeast Asia by traders and monks."),
    facts: [
      L("Nhiều bia ký sớm nhất ở Đông Nam Á dùng chữ này.", "Many of Southeast Asia’s earliest inscriptions use it."),
      L("Là nguồn gốc chung của chữ Môn, Khmer, Chăm, Java…", "Common source of the Mon, Khmer, Cham and Javanese scripts."),
    ],
    x: 270, y: 300,
  },
  {
    id: "old-mon", name: L("Môn cổ", "Old Mon"), period: L("~thế kỷ 6–7", "~6th–7th c."), region: L("Dvaravati (miền Trung Thái Lan)", "Dvaravati (central Thailand)"),
    summary: L("Chữ của người Môn ở vương quốc Dvaravati, sau này là nền của chữ Miến và chữ Tai Tham.", "Script of the Mon kingdom of Dvaravati; later the basis of Burmese and Tai Tham."),
    facts: [
      L("Người Môn là cư dân lâu đời vùng lưu vực Chao Phraya trước người Thái.", "The Mon lived in the Chao Phraya basin before the Tai arrived."),
      L("Ảnh hưởng tới chữ Sukhothai qua một số hình chữ.", "Influenced some letter shapes of the Sukhothai script."),
    ],
    x: 450, y: 150,
  },
  {
    id: "old-khmer", name: L("Khmer cổ", "Old Khmer"), period: L("~thế kỷ 7", "~7th c."), region: L("Chân Lạp / Angkor", "Chenla / Angkor"), ka: "ក", kaFont: "font-khmer",
    summary: L("Nguồn trực tiếp quan trọng nhất của chữ Thái: đế chế Angkor từng cai quản vùng Sukhothai.", "The most direct source of Thai script: the Angkor empire once ruled the Sukhothai region."),
    facts: [
      L("Chữ Thái mượn hệ thống phụ âm và cách viết nguyên âm quanh phụ âm từ đây.", "Thai borrowed its consonant inventory and vowel placement from it."),
      L("Nhiều từ Khmer còn trong tiếng Thái, vd. เดิน (đi bộ).", "Many Khmer words survive in Thai, e.g. เดิน (to walk)."),
    ],
    x: 450, y: 420,
  },
  {
    id: "sukhothai", name: L("Sukhothai", "Sukhothai"), period: L("1283 (theo truyền thống)", "1283 (traditional date)"), region: L("Vương quốc Sukhothai", "Sukhothai Kingdom"),
    summary: L("Theo truyền thống, vua Ram Khamhaeng tạo ra chữ Thái năm 1283 dựa trên chữ Khmer cổ.", "Tradition credits King Ram Khamhaeng with creating Thai script in 1283, based on Old Khmer."),
    facts: [
      L("Đổi mới lớn: thêm dấu thanh (่ ้) để ghi thanh điệu, điều chữ Khmer không có.", "Key innovation: tone marks (่ ้), which Khmer script lacks."),
      L("Ban đầu nguyên âm được viết cùng dòng với phụ âm; về sau mới chuyển lên trên, xuống dưới.", "Vowels were first written on the same line as consonants, later moved above and below."),
      L("Tính xác thực của bia Ram Khamhaeng vẫn còn tranh luận trong giới học thuật.", "The authenticity of the Ram Khamhaeng inscription is still debated by scholars."),
    ],
    x: 640, y: 330,
  },
  {
    id: "tai-tham", name: L("Tai Tham (Lan Na)", "Tai Tham (Lanna)"), period: L("~thế kỷ 13–14", "~13th–14th c."), region: L("Lan Na (Bắc Thái)", "Lanna (northern Thailand)"), ka: "ᨠ", kaFont: "font-taitham",
    summary: L("Nhánh riêng, phát triển từ chữ Môn, dùng chủ yếu để chép kinh Phật ở miền Bắc.", "A separate branch from Mon, used mainly for Buddhist texts in the north."),
    facts: [
      L("“Tham” nghĩa là Pháp (Dhamma).", "“Tham” means Dhamma."),
      L("Vẫn còn được dùng ở chùa và trong giới bảo tồn văn hoá Lan Na.", "Still used in temples and by Lanna cultural revivalists."),
    ],
    x: 640, y: 120,
  },
  {
    id: "fakkham", name: L("Fak Kham", "Fak Kham"), period: L("~thế kỷ 14–15", "~14th–15th c."), region: L("Lan Na", "Lanna"),
    summary: L("Biến thể của chữ Sukhothai dùng ở miền Bắc, song song với Tai Tham.", "A northern variant of Sukhothai script, used alongside Tai Tham."),
    facts: [L("Tên nghĩa là “vỏ me”, gợi hình nét chữ cong.", "The name means “tamarind pod”, after its curved strokes.")],
    x: 820, y: 210,
  },
  {
    id: "lao", name: L("Chữ Lào", "Lao"), period: L("~thế kỷ 16", "~16th c."), region: L("Lan Xang", "Lan Xang"), ka: "ກ", kaFont: "font-lao",
    summary: L("Chị em gần nhất của chữ Thái, cùng tách ra từ dòng chữ Sukhothai.", "Thai’s closest sister script, branching from the same Sukhothai line."),
    facts: [
      L("Được giản lược mạnh: bỏ các phụ âm dư thừa dành cho từ gốc Pali-Sanskrit.", "Heavily simplified: dropped the extra consonants used for Pali-Sanskrit words."),
      L("Người đọc chữ Thái thường đoán được nhiều chữ Lào.", "Thai readers can often guess many Lao letters."),
    ],
    x: 820, y: 330,
  },
  {
    id: "ayutthaya", name: L("Ayutthaya", "Ayutthaya"), period: L("1351–1767", "1351–1767"), region: L("Vương quốc Ayutthaya", "Ayutthaya Kingdom"),
    summary: L("Chữ Thái ổn định dần; hai dấu thanh ๊ và ๋ xuất hiện trong thời kỳ này.", "Thai script stabilizes; the tone marks ๊ and ๋ appear in this period."),
    facts: [
      L("Sách dạy chữ Chindamani (thời vua Narai) là tài liệu ngữ pháp Thái cổ nổi tiếng.", "The Chindamani primer (King Narai’s reign) is a famous early Thai grammar."),
      L("Hệ thống 3 nhóm phụ âm được hệ thống hoá.", "The three-class consonant system is codified."),
    ],
    x: 820, y: 460,
  },
  {
    id: "modern", name: L("Thái hiện đại", "Modern Thai"), period: L("thế kỷ 19 – nay", "19th c. – today"), region: L("Thái Lan", "Thailand"), ka: "ก", kaFont: "font-thai",
    summary: L("Chuẩn hoá cùng nghề in; 44 phụ âm, 4 dấu thanh, khoảng 32 dạng nguyên âm.", "Standardized with printing: 44 consonants, 4 tone marks, about 32 vowel forms."),
    facts: [
      L("ฃ và ฅ vẫn nằm trong bảng chữ nhưng đã không còn dùng.", "ฃ and ฅ remain in the alphabet but are no longer used."),
      L("Thập niên 1940 từng có cải cách giản lược chữ, sau đó bị bãi bỏ.", "A 1940s spelling simplification was later reversed."),
    ],
    x: 930, y: 550,
  },
];

export const SCRIPT_EDGES: ScriptEdge[] = [
  { from: "brahmi", to: "pallava", kind: "descent" },
  { from: "pallava", to: "old-mon", kind: "descent" },
  { from: "pallava", to: "old-khmer", kind: "descent" },
  { from: "old-khmer", to: "sukhothai", kind: "descent" },
  { from: "old-mon", to: "sukhothai", kind: "influence" },
  { from: "old-mon", to: "tai-tham", kind: "descent" },
  { from: "sukhothai", to: "fakkham", kind: "descent" },
  { from: "sukhothai", to: "lao", kind: "descent" },
  { from: "sukhothai", to: "ayutthaya", kind: "descent" },
  { from: "ayutthaya", to: "modern", kind: "descent" },
];

/** Tổ tiên của một node (chỉ theo quan hệ "descent") để tô sáng dòng dõi. */
export function lineageOf(id: string): Set<string> {
  const out = new Set<string>([id]);
  let frontier = [id];
  while (frontier.length) {
    const next: string[] = [];
    for (const n of frontier)
      for (const e of SCRIPT_EDGES)
        if (e.to === n && e.kind === "descent" && !out.has(e.from)) {
          out.add(e.from);
          next.push(e.from);
        }
    frontier = next;
  }
  return out;
}
