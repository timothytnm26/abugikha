import { Hono } from "hono";
import { PreferencesSchema } from "@abugikha/contracts";
import type { AppEnv } from "../../env";
import { validate } from "../../lib/validate";
import { requireAuth } from "../../middleware/auth";
import { getPreferences, putPreferences } from "./service";

export const preferenceRoutes = new Hono<AppEnv>()
  .use(requireAuth)
  .get("/", async (c) => c.json(await getPreferences(c.get("db"), c.get("userId"))))
  .put("/", validate("json", PreferencesSchema), async (c) =>
    c.json(await putPreferences(c.get("db"), c.get("userId"), c.req.valid("json"))),
  );
