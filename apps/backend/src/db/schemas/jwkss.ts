import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const jwkss = pgTable("jwkss", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
  expiresAt: timestamp("expires_at"),
});

export type Jwk = typeof jwkss.$inferSelect;
export type JwkInsert = typeof jwkss.$inferInsert;
