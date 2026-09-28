import { z } from "zod";
import { HexColorSchema, PaletteKeySchema, TimestampSchema } from "./common";

const PaletteOverridesSchema = z.partialRecord(PaletteKeySchema, HexColorSchema);

/** Tuỳ chỉnh giao diện/học tập. Thêm trường mới luôn kèm `.default()` để bản ghi cũ vẫn hợp lệ. */
export const PreferencesSchema = z.object({
  showPhonetic: z.boolean().default(true),
  theme: z.enum(["system", "light", "dark"]).default("system"),
  palette: z
    .object({ light: PaletteOverridesSchema.default({}), dark: PaletteOverridesSchema.default({}) })
    .default({ light: {}, dark: {} }),
});
export type Preferences = z.infer<typeof PreferencesSchema>;

export const PreferencesResponseSchema = z.object({
  preferences: PreferencesSchema,
  updatedAt: TimestampSchema.nullable(),
});
export type PreferencesResponse = z.infer<typeof PreferencesResponseSchema>;
