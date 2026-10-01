export const FONTS =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Charis+SIL:ital,wght@0,400;0,700;1,400&family=Noto+Serif+Thai:wght@400;500&family=Noto+Sans+Khmer&family=Noto+Sans+Lao&family=Noto+Sans+Tai+Tham&family=Noto+Sans+Brahmi&family=Noto+Sans+Devanagari&family=Noto+Sans+Tamil&family=Noto+Sans+Javanese&family=Noto+Sans+Cham&family=Noto+Sans+Tai+Viet&display=swap";

export type ThaiFontStyle = "looped" | "loopless" | "handwriting";

/**
 * Font để so sánh hình chữ ở trang Aksorn Thai: một font có đầu (มีหัว, kiểu dạy viết), một font không đầu
 * (ไม่มีหัว, hay gặp trên biển hiệu, quảng cáo) và hai font viết tay.
 */
export const THAI_SPECIMEN_FONTS: { family: string; style: ThaiFontStyle }[] = [
  { family: "Noto Sans Thai Looped", style: "looped" },
  { family: "Kanit", style: "loopless" },
  { family: "Charm", style: "handwriting" },
  { family: "Playpen Sans Thai", style: "handwriting" },
];

/** Chỉ nạp ở trang Aksorn Thai */
export const THAI_SPECIMEN_CSS = `https://fonts.googleapis.com/css2?${THAI_SPECIMEN_FONTS.map((f) => `family=${f.family.replaceAll(" ", "+")}`).join("&")}&display=swap`;

/** Tên đầy đủ của Bangkok (tên dài nhất thế giới theo chữ Thái) và các font để nó bay qua lại ở cuối trang chủ. */
export const BANGKOK_FULL_NAME =
  "กรุงเทพมหานคร อมรรัตนโกสินทร์ มหินทรายุธยา มหาดิลกภพ นพรัตน์ราชธานีบูรีรมย์ อุดมราชนิเวศน์มหาสถาน อมรพิมานอวตารสถิต สักกะทัตติยวิษณุกรรมประสิทธิ์";
export const BANGKOK_MARQUEE_FONTS = ["Noto Sans Thai Looped", "Kanit", "Charm", "Playpen Sans Thai", "Mali", "Pridi"];
export const BANGKOK_MARQUEE_CSS = `https://fonts.googleapis.com/css2?${BANGKOK_MARQUEE_FONTS.map((f) => `family=${f.replaceAll(" ", "+")}`).join("&")}&display=swap`;
