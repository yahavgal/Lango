/* Imports */
import "dotenv/config"; // Load environment variables from a .env file
import type { Config } from "drizzle-kit"; // Import the Config type from drizzle-kit

/* Exports */
/* This configuration object is used by Drizzle Kit to manage database migrations and schema generation. */
export default {
    schema: "./database/schema.ts", // Path to the TypeScript file that defines the database schema
    out: "./drizzle", // Directory where Drizzle Kit will output generated files
    dialect: "postgresql", // Database dialect
    dbCredentials: { // Database credentials
        url: process.env.DATABASE_URL!, // Database URL retrieved from an environment variable, with '!' to assert its presence
    },
} satisfies Config; // Ensure that this configuration object satisfies the 'Config' type
