import { z } from "zod";
import { LocaleSchema, TimestampSchema } from "./common";

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string().nullable(),
  locale: LocaleSchema,
  createdAt: TimestampSchema,
});
export type User = z.infer<typeof UserSchema>;

export const UpdateMeSchema = z
  .object({
    displayName: z.string().trim().min(1).max(40).nullable(),
    locale: LocaleSchema,
  })
  .partial();
export type UpdateMe = z.infer<typeof UpdateMeSchema>;
