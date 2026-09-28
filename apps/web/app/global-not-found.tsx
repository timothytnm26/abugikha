import type { Metadata } from "next";
import { FONTS } from "@/shared/config/fonts";
import { BASE_PATH } from "@/shared/config/metadata";
import "@/app/styles/globals.css";

export const metadata: Metadata = { title: "404 – Abugikha" };

export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body className="grid min-h-dvh place-items-center bg-paper p-6 text-ink">
        <main className="text-center">
          <p className="font-thai text-6xl">ไม่พบ</p>
          <h1 className="mt-4 text-xl font-semibold">404</h1>
          <p className="mt-2 text-ink-soft">
            Không tìm thấy trang · Page not found
          </p>
          <p className="mt-6 flex justify-center gap-4 underline">
            <a href={`${BASE_PATH}/vi/`}>Trang chủ</a>
            <a href={`${BASE_PATH}/en/`}>Home</a>
          </p>
        </main>
      </body>
    </html>
  );
}
