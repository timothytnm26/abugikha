/** Pha màu (thường là CSS var) với trong suốt – chạy được ở cả theme sáng và tối. */
/** Màu chữ đặt trên nền `tint` của chính nó: ngả về màu chữ chính để đủ tương phản ở mọi giao diện. */
export const onTint = (color: string) => `color-mix(in oklab, ${color} 65%, var(--color-ink))`;

export const tint = (color: string, percent: number) => `color-mix(in oklab, ${color} ${percent}%, transparent)`;
