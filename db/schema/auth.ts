import { pgSchema, uuid, text, timestamp } from "drizzle-orm/pg-core";

const neonAuthSchema = pgSchema("neon_auth");

/**
 * Read-only mirror of Neon Auth's managed user table. Neon Auth (not this
 * app) owns writes to `neon_auth.user` — rows appear automatically as
 * users sign up / sign in via the hosted auth server.
 */
export const usersSync = neonAuthSchema.table("user", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});
