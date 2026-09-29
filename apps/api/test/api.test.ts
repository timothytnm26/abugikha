import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import type { PreferencesResponse, ProgressItem, ProgressList, Session, User } from "@abugikha/contracts";
import { app } from "../src/app";

const call = (path: string, init: RequestInit & { token?: string; json?: unknown } = {}) => {
  const { token, json, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (json !== undefined) headers.set("content-type", "application/json");
  return app.request(path, { ...rest, headers, body: json === undefined ? rest.body : JSON.stringify(json) }, env);
};

async function signIn(locale?: "vi" | "en") {
  const res = await call("/v1/auth/anonymous", { method: "POST", json: locale ? { locale } : {} });
  expect(res.status).toBe(201);
  return (await res.json()) as Session;
}

const item = (itemId: string, updatedAt: string, patch: Partial<ProgressItem> = {}): ProgressItem => ({
  itemType: "consonant",
  itemId,
  status: "learning",
  correct: 1,
  attempts: 2,
  lastReviewedAt: updatedAt,
  updatedAt,
  ...patch,
});

describe("auth", () => {
  it("tạo người dùng ẩn danh và trả token dùng được", async () => {
    const s = await signIn("en");
    expect(s.token.length).toBeGreaterThan(30);
    expect(s.user.locale).toBe("en");

    const me = await call("/v1/me", { token: s.token });
    expect(me.status).toBe(200);
    expect(((await me.json()) as User).id).toBe(s.user.id);
  });

  it("từ chối khi thiếu hoặc sai token", async () => {
    expect((await call("/v1/me")).status).toBe(401);
    const res = await call("/v1/me", { token: "sai" });
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: { code: "unauthorized" } });
  });

  it("đăng xuất thu hồi token", async () => {
    const s = await signIn();
    expect((await call("/v1/auth/logout", { method: "POST", token: s.token })).status).toBe(204);
    expect((await call("/v1/me", { token: s.token })).status).toBe(401);
  });
});

describe("me", () => {
  it("cập nhật tên hiển thị và locale, kiểm tra dữ liệu vào", async () => {
    const s = await signIn();
    const ok = await call("/v1/me", { method: "PATCH", token: s.token, json: { displayName: "  Timo ", locale: "en" } });
    expect(await ok.json()).toMatchObject({ displayName: "Timo", locale: "en" });

    const bad = await call("/v1/me", { method: "PATCH", token: s.token, json: { locale: "fr" } });
    expect(bad.status).toBe(400);
    expect(await bad.json()).toMatchObject({ error: { code: "invalid_request" } });
  });

  it("xoá tài khoản xoá luôn phiên", async () => {
    const s = await signIn();
    expect((await call("/v1/me", { method: "DELETE", token: s.token })).status).toBe(204);
    expect((await call("/v1/me", { token: s.token })).status).toBe(401);
  });
});

describe("preferences", () => {
  it("trả mặc định khi chưa lưu, rồi lưu và đọc lại", async () => {
    const s = await signIn();
    const first = (await (await call("/v1/me/preferences", { token: s.token })).json()) as PreferencesResponse;
    expect(first).toEqual({ preferences: { showPhonetic: true, theme: "system", palette: { light: {}, dark: {} } }, updatedAt: null });

    const prefs = { showPhonetic: false, theme: "dark", palette: { light: {}, dark: { mid: "#112233" } } };
    expect((await call("/v1/me/preferences", { method: "PUT", token: s.token, json: prefs })).status).toBe(200);
    const again = (await (await call("/v1/me/preferences", { token: s.token })).json()) as PreferencesResponse;
    expect(again.preferences).toEqual(prefs);
    expect(again.updatedAt).not.toBeNull();
  });

  it("từ chối màu sai định dạng hoặc khoá palette lạ", async () => {
    const s = await signIn();
    const res = await call("/v1/me/preferences", { method: "PUT", token: s.token, json: { palette: { light: { mid: "red" }, dark: {} } } });
    expect(res.status).toBe(400);
  });
});

describe("progress", () => {
  it("ghi theo last-write-wins và đồng bộ tăng dần bằng since", async () => {
    const s = await signIn();
    const t1 = "2026-01-01T00:00:00.000Z";
    const t2 = "2026-01-02T00:00:00.000Z";

    const put1 = await call("/v1/me/progress", { method: "PUT", token: s.token, json: { items: [item("ก", t2), item("ข", t1)] } });
    expect(await put1.json()).toMatchObject({ applied: 2 });

    // ก cũ hơn bản server → bỏ qua; ข mới hơn → ghi đè
    const put2 = await call("/v1/me/progress", {
      method: "PUT",
      token: s.token,
      json: { items: [item("ก", t1, { status: "seen" }), item("ข", t2, { status: "mastered" })] },
    });
    expect(await put2.json()).toMatchObject({ applied: 1 });

    const list = (await (await call("/v1/me/progress", { token: s.token })).json()) as ProgressList;
    const byId = Object.fromEntries(list.items.map((i) => [i.itemId, i.status]));
    expect(byId).toEqual({ ก: "learning", ข: "mastered" });

    const later = (await (await call(`/v1/me/progress?since=${encodeURIComponent(list.serverTime)}`, { token: s.token })).json()) as ProgressList;
    expect(later.items).toEqual([]);
  });

  it("chia nhỏ lô lớn vượt giới hạn tham số của D1", async () => {
    const s = await signIn();
    const items = Array.from({ length: 150 }, (_, i) => item(`syl-${i}`, "2026-01-01T00:00:00.000Z", { itemType: "syllable" }));
    const res = await call("/v1/me/progress", { method: "PUT", token: s.token, json: { items } });
    expect(await res.json()).toMatchObject({ applied: 150 });
    const list = (await (await call("/v1/me/progress?type=syllable", { token: s.token })).json()) as ProgressList;
    expect(list.items).toHaveLength(150);
  });

  it("không đọc được tiến độ của người khác", async () => {
    const a = await signIn();
    const b = await signIn();
    await call("/v1/me/progress", { method: "PUT", token: a.token, json: { items: [item("ก", "2026-01-01T00:00:00.000Z")] } });
    const list = (await (await call("/v1/me/progress", { token: b.token })).json()) as ProgressList;
    expect(list.items).toEqual([]);
  });
});

describe("hạ tầng", () => {
  it("health và 404 dạng JSON", async () => {
    expect(await (await call("/health")).json()).toEqual({ ok: true, version: "v1" });
    const res = await call("/v1/khong-co");
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ error: { code: "not_found" } });
  });

  it("CORS chỉ mở cho origin trong danh sách", async () => {
    const ok = await call("/health", { headers: { origin: "http://localhost:3000" } });
    expect(ok.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
    const no = await call("/health", { headers: { origin: "https://evil.example" } });
    expect(no.headers.get("access-control-allow-origin")).toBeNull();
  });
});
