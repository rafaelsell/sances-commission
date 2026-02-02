import { uuid } from "drizzle-orm/pg-core";
import { pgTable, text, decimal, timestamp } from "drizzle-orm/pg-core";
import { sellers } from "./sellers";

export const sales = pgTable("sales", {
  id: uuid("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  sellerId: uuid("seller_id")
    .references(() => sellers.id)
    .notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  saleDate: timestamp("sale_date").defaultNow().notNull(),
  appliedSellerFixed: decimal("applied_seller_fixed", {
    precision: 10,
    scale: 2,
  }).notNull(),
  appliedSellerPercent: decimal("applied_seller_percent", {
    precision: 5,
    scale: 2,
  }).notNull(),
  totalCommissionSeller: decimal("total_commission_seller", {
    precision: 10,
    scale: 2,
  }).notNull(),
  appliedManagerFixed: decimal("applied_manager_fixed", {
    precision: 10,
    scale: 2,
  }).notNull(),
  appliedManagerPercent: decimal("applied_manager_percent", {
    precision: 5,
    scale: 2,
  }).notNull(),
  totalCommissionManager: decimal("total_commission_manager", {
    precision: 10,
    scale: 2,
  }).notNull(),
  ruleDescriptionSeller: text("rule_description_seller"),
  ruleDescriptionManager: text("rule_description_manager"),
});

export type Sale = typeof sales.$inferSelect;
export type SaleInsert = typeof sales.$inferInsert;
export type SaleUpdate = Partial<SaleInsert>;
