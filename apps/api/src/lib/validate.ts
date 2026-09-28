import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { z } from "zod";
import { errorBody } from "./errors";

/** zValidator trả lỗi theo cùng định dạng ApiErrorSchema. */
export const validate = <T extends z.ZodType, Target extends keyof ValidationTargets>(target: Target, schema: T) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(errorBody("invalid_request", "Dữ liệu không hợp lệ", result.error.issues), 400);
    }
  });
