import { and, asc, eq, gte, sql, type SQL } from "drizzle-orm";
import type { ProgressItem, ProgressList, ProgressQuery, ProgressUpsertResult } from "@abugikha/contracts";
import { schema, type Database } from "../../db/client";
import { toIso, toIsoOrNull } from "../../lib/time";

const { progress } = schema;

/** D1 giới hạn 100 tham số mỗi câu lệnh; mỗi dòng dùng 9 → tối đa 11 dòng/câu. */
const ROWS_PER_STATEMENT = 11;
/** Chặn đồng hồ client chạy nhanh làm bản ghi "khoá" mãi ở tương lai */
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

type Row = typeof progress.$inferSelect;
const toItem = (r: Row): ProgressItem => ({
  itemType: r.itemType as ProgressItem["itemType"],
  itemId: r.itemId,
  status: r.status,
  correct: r.correct,
  attempts: r.attempts,
  lastReviewedAt: toIsoOrNull(r.lastReviewedAt),
  updatedAt: toIso(r.updatedAt),
});

export async function listProgress(db: Database, userId: string, query: ProgressQuery): Promise<ProgressList> {
  // Lấy mốc trước khi đọc để lần đồng bộ sau không bỏ sót bản ghi ghi song song
  const serverTime = new Date();
  const where: SQL[] = [eq(progress.userId, userId)];
  if (query.type) where.push(eq(progress.itemType, query.type));
  if (query.since) where.push(gte(progress.syncedAt, new Date(query.since)));
  const rows = await db.select().from(progress).where(and(...where)).orderBy(asc(progress.syncedAt));
  return { items: rows.map(toItem), serverTime: toIso(serverTime) };
}

/** Ghi theo last-write-wins: chỉ ghi đè khi `updatedAt` của client mới hơn bản đang có. */
export async function upsertProgress(db: Database, userId: string, items: ProgressItem[]): Promise<ProgressUpsertResult> {
  const now = new Date();
  const latest = now.getTime() + MAX_CLOCK_SKEW_MS;
  const rows = items.map((i) => ({
    userId,
    itemType: i.itemType,
    itemId: i.itemId,
    status: i.status,
    correct: i.correct,
    attempts: i.attempts,
    lastReviewedAt: i.lastReviewedAt ? new Date(Math.min(Date.parse(i.lastReviewedAt), latest)) : null,
    updatedAt: new Date(Math.min(Date.parse(i.updatedAt), latest)),
    syncedAt: now,
  }));

  const statements = [];
  for (let i = 0; i < rows.length; i += ROWS_PER_STATEMENT) {
    statements.push(
      db
        .insert(progress)
        .values(rows.slice(i, i + ROWS_PER_STATEMENT))
        .onConflictDoUpdate({
          target: [progress.userId, progress.itemType, progress.itemId],
          set: {
            status: sql`excluded.status`,
            correct: sql`excluded.correct`,
            attempts: sql`excluded.attempts`,
            lastReviewedAt: sql`excluded.last_reviewed_at`,
            updatedAt: sql`excluded.updated_at`,
            syncedAt: sql`excluded.synced_at`,
          },
          setWhere: sql`excluded.updated_at > ${progress.updatedAt}`,
        }),
    );
  }
  const [first, ...rest] = statements;
  const results = first ? await db.batch([first, ...rest]) : [];
  const applied = results.reduce((n, r) => n + (r.meta.changes ?? 0), 0);
  return { applied, serverTime: toIso(now) };
}
