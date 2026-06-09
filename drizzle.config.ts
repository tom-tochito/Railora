import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "railora-demo-account",
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "railora-demo-d1",
    token: process.env.CLOUDFLARE_D1_TOKEN ?? "railora-demo-token",
  },
});
