import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { API_VERSION } from "@abugikha/contracts";
import { createDb } from "./db/client";
import type { AppEnv } from "./env";
import { ApiError, errorBody } from "./lib/errors";
import { authRoutes } from "./modules/auth/routes";
import { preferenceRoutes } from "./modules/preferences/routes";
import { progressRoutes } from "./modules/progress/routes";
import { userRoutes } from "./modules/users/routes";

/** Mỗi module là một router Hono độc lập; thêm tính năng = thêm module và gắn vào đây. */
const v1 = new Hono<AppEnv>()
  .route("/auth", authRoutes)
  .route("/me", userRoutes)
  .route("/me/preferences", preferenceRoutes)
  .route("/me/progress", progressRoutes);

export const app = new Hono<AppEnv>()
  .use(secureHeaders())
  .use(
    cors({
      // App mobile không gửi Origin nên không bị CORS chặn; danh sách này chỉ dành cho trình duyệt
      origin: (origin, c: Context<AppEnv>) => (c.env.CORS_ORIGINS.split(",").map((s) => s.trim()).includes(origin) ? origin : null),
      allowHeaders: ["authorization", "content-type"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 86400,
    }),
  )
  .use(async (c, next) => {
    c.set("db", createDb(c.env.DB));
    await next();
  })
  .get("/health", (c) => c.json({ ok: true, version: API_VERSION }))
  .route(`/${API_VERSION}`, v1);

app.notFound((c) => c.json(errorBody("not_found", "Không có endpoint này"), 404));

app.onError((err, c) => {
  if (err instanceof ApiError) return c.json(errorBody(err.code, err.message, err.details), err.status);
  if (err instanceof HTTPException) return c.json(errorBody("http_error", err.message), err.status);
  console.error(err);
  return c.json(errorBody("internal", "Lỗi máy chủ"), 500);
});

/** Kiểu của toàn bộ API, dùng được với `hc<AppType>()` của Hono nếu cần client RPC. */
export type AppType = typeof app;
