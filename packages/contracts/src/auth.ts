import { z } from "zod";
import { LocaleSchema, TimestampSchema } from "./common";
import { UserSchema } from "./user";

/**
 * Hiện chỉ có tài khoản ẩn danh theo thiết bị: gọi một lần, lưu token vào bộ nhớ an toàn.
 * Sau này thêm đăng nhập email/OAuth thì liên kết vào đúng user này, không mất tiến độ.
 */
export const AnonymousSignInSchema = z.object({
  locale: LocaleSchema.optional(),
});
export type AnonymousSignIn = z.infer<typeof AnonymousSignInSchema>;

export const SessionSchema = z.object({
  token: z.string(),
  expiresAt: TimestampSchema,
  user: UserSchema,
});
export type Session = z.infer<typeof SessionSchema>;
