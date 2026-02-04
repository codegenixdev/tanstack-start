import { drizzle } from "drizzle-orm/better-sqlite3";
import { getDatabaseUrl } from "@/routes/-lib/utils.ts";
import * as schema from "./schema.ts";

export const db = drizzle(getDatabaseUrl(), { schema });
