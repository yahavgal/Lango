/* Imports */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/* Create a database connection */
const sql = neon(process.env.DATABASE_URL!);
const database = drizzle(sql, { schema });

/* Export the database */
export default database;