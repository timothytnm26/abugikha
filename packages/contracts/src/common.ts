import { z } from "zod";
import { LOCALES, PALETTE_KEYS } from "@abugikha/core";

export const LocaleSchema = z.enum(LOCALES);
export const HexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i, "Màu dạng #rrggbb");
export const PaletteKeySchema = z.enum(PALETTE_KEYS);
/** Thời điểm dạng ISO 8601 (UTC) */
export const TimestampSchema = z.iso.datetime();

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;
