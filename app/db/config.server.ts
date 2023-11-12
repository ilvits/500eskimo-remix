import * as schema from "./schema.server";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pkg from "pg";

const { Client } = pkg;
const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "500eskimo",
  password: process.env.POSTGRES_PASSWORD,
  database: "500eskimo",
});

client.connect();
export const db = drizzle(client, { schema });

migrate(drizzle(client), {
  migrationsFolder: "./app/db/migrations",
});
