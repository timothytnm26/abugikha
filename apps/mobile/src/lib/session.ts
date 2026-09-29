import * as SecureStore from "expo-secure-store";
import { createApiClient } from "@abugikha/contracts/client";
import type { Locale } from "@abugikha/core";
import { API_URL } from "./config";

const TOKEN_KEY = "abugikha.session-token";
let cached: string | null | undefined;

async function getToken() {
  if (cached === undefined) cached = await SecureStore.getItemAsync(TOKEN_KEY);
  return cached;
}

async function setToken(token: string | null) {
  cached = token;
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export const api = createApiClient({ baseUrl: API_URL, getToken });

/** Bảo đảm có phiên: lần đầu mở app sẽ tạo tài khoản ẩn danh. Ném lỗi nếu không tới được API. */
export async function ensureSession(locale: Locale): Promise<void> {
  if (await getToken()) return;
  const session = await api.auth.anonymous({ locale });
  await setToken(session.token);
}

/** Token hết hạn/bị thu hồi thì bỏ để lần sau tạo phiên mới. */
export async function clearSession() {
  await setToken(null);
}
