import type { NextConfig } from "next";

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserPage = repository === `${owner}.github.io`;
const basePath =
  process.env.GITHUB_PAGES === "true" && repository && !isUserPage
    ? `/${repository}`
    : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
