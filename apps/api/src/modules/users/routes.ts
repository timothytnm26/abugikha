import { Hono } from "hono";
import { UpdateMeSchema } from "@abugikha/contracts";
import type { AppEnv } from "../../env";
import { validate } from "../../lib/validate";
import { requireAuth } from "../../middleware/auth";
import { deleteUser, getUser, updateUser } from "./service";

export const userRoutes = new Hono<AppEnv>()
  .use(requireAuth)
  .get("/", async (c) => c.json(await getUser(c.get("db"), c.get("userId"))))
  .patch("/", validate("json", UpdateMeSchema), async (c) =>
    c.json(await updateUser(c.get("db"), c.get("userId"), c.req.valid("json"))),
  )
  .delete("/", async (c) => {
    await deleteUser(c.get("db"), c.get("userId"));
    return c.body(null, 204);
  });
