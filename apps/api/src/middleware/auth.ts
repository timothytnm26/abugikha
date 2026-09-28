import { and, eq, gt } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { schema } from "../db/client";
import type { AppEnv } from "../env";
import { hashToken } from "../lib/crypto";
import { unauthorized } from "../lib/errors";
import { DAY_MS } from "../lib/time";

/** Xác thực `Authorization: Bearer <token>`; gia hạn phiên (trượt) tối đa một lần mỗi ngày. */
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const token = c.req.header("authorization")?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) throw unauthorized();

  const now = new Date();
  const db = c.get("db");
  const session = await db.query.sessions.findFirst({
    where: and(eq(schema.sessions.tokenHash, await hashToken(token)), gt(schema.sessions.expiresAt, now)),
    columns: { id: true, userId: true, lastUsedAt: true },
  });
  if (!session) throw unauthorized();

  if (now.getTime() - session.lastUsedAt.getTime() > DAY_MS) {
    const ttl = Number(c.env.SESSION_TTL_DAYS) * DAY_MS;
    await db
      .update(schema.sessions)
      .set({ lastUsedAt: now, expiresAt: new Date(now.getTime() + ttl) })
      .where(eq(schema.sessions.id, session.id));
  }

  c.set("userId", session.userId);
  c.set("sessionId", session.id);
  await next();
});
