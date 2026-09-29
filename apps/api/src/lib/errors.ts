import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiErrorBody } from "@abugikha/contracts";

/** Lỗi nghiệp vụ; app.onError chuyển thành JSON theo ApiErrorSchema. */
export class ApiError extends HTTPException {
  constructor(
    status: ContentfulStatusCode,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(status, { message });
  }
}

export const errorBody = (code: string, message: string, details?: unknown): ApiErrorBody => ({
  error: { code, message, ...(details !== undefined && { details }) },
});

export const unauthorized = () => new ApiError(401, "unauthorized", "Thiếu hoặc sai token phiên");
export const notFound = (what: string) => new ApiError(404, "not_found", `Không tìm thấy ${what}`);
