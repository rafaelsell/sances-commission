import { relations } from "drizzle-orm";
import { accounts } from "../accounts";
import { sessions } from "../sessions";
import { users } from "../users";
import { sellers } from "../sellers";
import { sales } from "../sales";

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  sellers: many(sellers),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  manager: one(users, { fields: [sellers.userId], references: [users.id] }),
  sales: many(sales),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  seller: one(sellers, { fields: [sales.sellerId], references: [sellers.id] }),
}));
