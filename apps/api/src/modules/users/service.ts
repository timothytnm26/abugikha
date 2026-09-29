import { eq } from "drizzle-orm";
import type { UpdateMe, User } from "@abugikha/contracts";
import { schema, type Database } from "../../db/client";
import { notFound } from "../../lib/errors";
import { toIso } from "../../lib/time";

type UserRow = typeof schema.users.$inferSelect;

export const toUser = (u: UserRow): User => ({
  id: u.id,
  displayName: u.displayName,
  locale: u.locale,
  createdAt: toIso(u.createdAt),
});

export async function getUser(db: Database, id: string): Promise<User> {
  const row = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  if (!row) throw notFound("người dùng");
  return toUser(row);
}

export async function updateUser(db: Database, id: string, patch: UpdateMe): Promise<User> {
  const [row] = await db
    .update(schema.users)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(schema.users.id, id))
    .returning();
  if (!row) throw notFound("người dùng");
  return toUser(row);
}

/** Xoá tài khoản và toàn bộ dữ liệu liên quan (ON DELETE CASCADE). */
export async function deleteUser(db: Database, id: string): Promise<void> {
  await db.delete(schema.users).where(eq(schema.users.id, id));
}
