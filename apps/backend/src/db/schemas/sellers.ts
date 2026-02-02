import { pgTable, uuid, text, decimal, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sellers = pgTable("sellers", {
  id: uuid("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  fixedCommission: decimal("fixed_commission", {
    precision: 10,
    scale: 2,
  }).default("0.00"),
  percentageCommission: decimal("percentage_commission", {
    precision: 5,
    scale: 2,
  }).default("0.00"),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Seller = typeof sellers.$inferSelect;
export type SellerInsert = typeof sellers.$inferInsert;
export type SellerUpdate = Partial<SellerInsert>;
