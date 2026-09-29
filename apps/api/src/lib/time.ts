export const DAY_MS = 24 * 60 * 60 * 1000;
export const toIso = (d: Date) => d.toISOString();
export const toIsoOrNull = (d: Date | null) => (d ? d.toISOString() : null);
