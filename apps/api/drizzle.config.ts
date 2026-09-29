import { defineConfig } from "drizzle-kit";

// Chỉ dùng để sinh file migration SQL; áp dụng migration bằng wrangler (db:migrate:*).
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
