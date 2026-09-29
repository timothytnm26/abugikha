import { z } from "zod";
import { TimestampSchema } from "./common";

/** Số mục tối đa mỗi lần đẩy tiến độ; client gửi nhiều hơn thì chia nhỏ. */
export const PROGRESS_BATCH_MAX = 200;

/** Loại nội dung được theo dõi; `itemId` là id trong @abugikha/core (vd. "ก", "aa", "หน้า"). */
export const ProgressItemTypeSchema = z.enum(["consonant", "vowel", "tone-mark", "syllable", "lesson"]);
export type ProgressItemType = z.infer<typeof ProgressItemTypeSchema>;

export const ProgressStatusSchema = z.enum(["seen", "learning", "mastered"]);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

export const ProgressItemSchema = z.object({
  itemType: ProgressItemTypeSchema,
  itemId: z.string().min(1).max(64),
  status: ProgressStatusSchema,
  correct: z.int().min(0),
  attempts: z.int().min(0),
  lastReviewedAt: TimestampSchema.nullable(),
  /** Thời điểm client sửa bản ghi; server giữ bản mới nhất (last-write-wins) để đồng bộ offline. */
  updatedAt: TimestampSchema,
});
export type ProgressItem = z.infer<typeof ProgressItemSchema>;

export const ProgressUpsertSchema = z.object({
  items: z.array(ProgressItemSchema).min(1).max(PROGRESS_BATCH_MAX),
});
export type ProgressUpsert = z.infer<typeof ProgressUpsertSchema>;

export const ProgressQuerySchema = z.object({
  type: ProgressItemTypeSchema.optional(),
  /** Chỉ lấy bản ghi đổi sau thời điểm này (đồng bộ tăng dần) */
  since: TimestampSchema.optional(),
});
export type ProgressQuery = z.infer<typeof ProgressQuerySchema>;

export const ProgressListSchema = z.object({
  items: z.array(ProgressItemSchema),
  /** Dùng làm `since` cho lần đồng bộ sau */
  serverTime: TimestampSchema,
});
export type ProgressList = z.infer<typeof ProgressListSchema>;

export const ProgressUpsertResultSchema = z.object({
  /** Số bản ghi được ghi (bản cũ hơn dữ liệu server bị bỏ qua) */
  applied: z.int().min(0),
  serverTime: TimestampSchema,
});
export type ProgressUpsertResult = z.infer<typeof ProgressUpsertResultSchema>;
