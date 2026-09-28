import type { z } from "zod";
import {
  ApiErrorSchema,
  API_VERSION,
  PreferencesResponseSchema,
  ProgressListSchema,
  ProgressUpsertResultSchema,
  SessionSchema,
  UserSchema,
  type AnonymousSignIn,
  type Preferences,
  type ProgressItem,
  type ProgressQuery,
  type UpdateMe,
} from "./index";

export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface ApiClientOptions {
  /** Gốc API, vd. "https://api.example.com" (không kèm /v1) */
  baseUrl: string;
  /** Trả về token phiên hiện tại (nếu có) */
  getToken?: () => string | null | Promise<string | null>;
  fetch?: typeof fetch;
}

/** Client fetch thuần, chạy được trên trình duyệt, React Native và Workers. */
export function createApiClient({ baseUrl, getToken, fetch: fetchImpl = globalThis.fetch }: ApiClientOptions) {
  const root = `${baseUrl.replace(/\/+$/, "")}/${API_VERSION}`;

  async function request<S extends z.ZodType>(
    schema: S,
    method: string,
    path: string,
    init: { body?: unknown; query?: Record<string, string | undefined> } = {},
  ): Promise<z.infer<S>> {
    const url = new URL(root + path);
    for (const [k, v] of Object.entries(init.query ?? {})) if (v !== undefined) url.searchParams.set(k, v);
    const token = await getToken?.();
    const res = await fetchImpl(url, {
      method,
      headers: {
        ...(init.body !== undefined && { "content-type": "application/json" }),
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
    const json: unknown = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) {
      const parsed = ApiErrorSchema.safeParse(json);
      const e = parsed.success ? parsed.data.error : { code: "http_error", message: res.statusText, details: undefined };
      throw new ApiClientError(res.status, e.code, e.message, e.details);
    }
    return schema.parse(json);
  }

  const none = { parse: () => undefined } as unknown as z.ZodType<void>;

  return {
    auth: {
      anonymous: (body: AnonymousSignIn = {}) => request(SessionSchema, "POST", "/auth/anonymous", { body }),
      logout: () => request(none, "POST", "/auth/logout"),
    },
    me: {
      get: () => request(UserSchema, "GET", "/me"),
      update: (body: UpdateMe) => request(UserSchema, "PATCH", "/me", { body }),
      remove: () => request(none, "DELETE", "/me"),
    },
    preferences: {
      get: () => request(PreferencesResponseSchema, "GET", "/me/preferences"),
      put: (preferences: Preferences) => request(PreferencesResponseSchema, "PUT", "/me/preferences", { body: preferences }),
    },
    progress: {
      list: (query: ProgressQuery = {}) => request(ProgressListSchema, "GET", "/me/progress", { query }),
      upsert: (items: ProgressItem[]) => request(ProgressUpsertResultSchema, "PUT", "/me/progress", { body: { items } }),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
