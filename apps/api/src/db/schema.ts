import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('subsec') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch('subsec') * 1000)`),
};

/**
 * Người học. Hiện tạo ẩn danh theo thiết bị; khi thêm đăng nhập (email/OAuth), tạo bảng
 * `auth_identities (user_id, provider, subject)` trỏ vào đây thay vì đổi bảng này.
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  displayName: text("display_name"),
  locale: text("locale", { enum: ["vi", "en"] }).notNull().default("vi"),
  ...timestamps,
});

/** Phiên đăng nhập: chỉ lưu SHA-256 của token, thu hồi được bằng cách xoá dòng. */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    userAgent: text("user_agent"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    lastUsedAt: integer("last_used_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/** Tuỳ chỉnh dạng JSON (được kiểm bằng PreferencesSchema), thêm trường không cần migration. */
export const userPreferences = sqliteTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data", { mode: "json" }).notNull(),
  updatedAt: timestamps.updatedAt,
});

/** Tiến độ học theo từng mục nội dung (phụ âm, nguyên âm, âm tiết, bài học…). */
export const progress = sqliteTable(
  "progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemType: text("item_type").notNull(),
    itemId: text("item_id").notNull(),
    status: text("status", { enum: ["seen", "learning", "mastered"] }).notNull(),
    correct: integer("correct").notNull().default(0),
    attempts: integer("attempts").notNull().default(0),
    lastReviewedAt: integer("last_reviewed_at", { mode: "timestamp_ms" }),
    /** Thời điểm sửa phía client, dùng cho last-write-wins */
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    /** Thời điểm server ghi nhận, dùng cho đồng bộ tăng dần (?since=) */
    syncedAt: integer("synced_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemType, t.itemId] }),
    index("progress_user_synced_idx").on(t.userId, t.syncedAt),
  ],
);
