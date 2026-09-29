/** Pha màu (thường là CSS var) với trong suốt – chạy được ở cả theme sáng và tối. */
export const tint = (color: string, percent: number) => `color-mix(in oklab, ${color} ${percent}%, transparent)`;
