import { Hono } from "hono";
import { ProgressQuerySchema, ProgressUpsertSchema } from "@abugikha/contracts";
import type { AppEnv } from "../../env";
import { validate } from "../../lib/validate";
import { requireAuth } from "../../middleware/auth";
import { listProgress, upsertProgress } from "./service";

export const progressRoutes = new Hono<AppEnv>()
  .use(requireAuth)
  .get("/", validate("query", ProgressQuerySchema), async (c) =>
    c.json(await listProgress(c.get("db"), c.get("userId"), c.req.valid("query"))),
  )
  .put("/", validate("json", ProgressUpsertSchema), async (c) =>
    c.json(await upsertProgress(c.get("db"), c.get("userId"), c.req.valid("json").items)),
  );
