import type { Database } from "./db/client";

export interface Bindings {
  DB: D1Database;
  CORS_ORIGINS: string;
  SESSION_TTL_DAYS: string;
}

export interface Variables {
  db: Database;
  /** Có sau middleware requireAuth */
  userId: string;
  sessionId: string;
}

export type AppEnv = { Bindings: Bindings; Variables: Variables };
