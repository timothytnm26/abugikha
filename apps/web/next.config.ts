import type { NextConfig } from "next";

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const onPages = process.env.GITHUB_PAGES === "true";
const isUserPage = repository === `${owner}.github.io`;
const basePath = onPages && repository && !isUserPage ? `/${repository}` : "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (onPages && owner ? `https://${owner}.github.io${basePath}` : "http://localhost:3000");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // Package nội bộ xuất thẳng mã TypeScript
  transpilePackages: ["@abugikha/core", "@abugikha/i18n"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  experimental: {
    // Trang 404 riêng vì app có nhiều root layout ((root) và [locale])
    globalNotFound: true,
  },
};

export default nextConfig;
