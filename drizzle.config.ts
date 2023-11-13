import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema.server.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_DB_URL || "",
  },
  verbose: true,
  strict: true,
});
