import { eq } from "drizzle-orm";
import type { Locale } from "@abugikha/core";
import type { Session } from "@abugikha/contracts";
import { schema, type Database } from "../../db/client";
import { generateToken, hashToken, newId } from "../../lib/crypto";
import { DAY_MS, toIso } from "../../lib/time";
import { toUser } from "../users/service";

interface AnonymousInput {
  locale?: Locale;
  userAgent?: string;
  ttlDays: number;
}

/** Tạo người dùng ẩn danh + phiên trong một batch (D1 batch là một transaction). */
export async function signInAnonymously(db: Database, input: AnonymousInput): Promise<Session> {
  const now = new Date();
  const userId = newId();
  const token = generateToken();
  const expiresAt = new Date(now.getTime() + input.ttlDays * DAY_MS);

  const [[user]] = await db.batch([
    db
      .insert(schema.users)
      .values({ id: userId, locale: input.locale ?? "vi", createdAt: now, updatedAt: now })
      .returning(),
    db.insert(schema.sessions).values({
      id: newId(),
      userId,
      tokenHash: await hashToken(token),
      userAgent: input.userAgent?.slice(0, 255) ?? null,
      expiresAt,
      lastUsedAt: now,
      createdAt: now,
    }),
  ]);

  return { token, expiresAt: toIso(expiresAt), user: toUser(user!) };
}

export async function revokeSession(db: Database, sessionId: string): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}
