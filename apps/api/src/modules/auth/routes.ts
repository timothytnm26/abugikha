import { Hono } from "hono";
import { AnonymousSignInSchema } from "@abugikha/contracts";
import type { AppEnv } from "../../env";
import { validate } from "../../lib/validate";
import { requireAuth } from "../../middleware/auth";
import { revokeSession, signInAnonymously } from "./service";

export const authRoutes = new Hono<AppEnv>()
  .post("/anonymous", validate("json", AnonymousSignInSchema), async (c) => {
    const session = await signInAnonymously(c.get("db"), {
      locale: c.req.valid("json").locale,
      userAgent: c.req.header("user-agent"),
      ttlDays: Number(c.env.SESSION_TTL_DAYS),
    });
    return c.json(session, 201);
  })
  .post("/logout", requireAuth, async (c) => {
    await revokeSession(c.get("db"), c.get("sessionId"));
    return c.body(null, 204);
  });
