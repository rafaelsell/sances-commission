import { sellers, type SellerInsert } from "@backend/db/schemas/sellers";
import { db } from "../../db";
import { users } from "@backend/db/schemas/users";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { sales, type SaleInsert } from "@backend/db/schemas/sales";

export class SalesRepository {
  async findSellerAndVerifyOwner(sellerId: string, userId: string) {
    const [result] = await db
      .select()
      .from(sellers)
      .where(and(eq(sellers.id, sellerId), eq(sellers.userId, userId)));
    return result;
  }

  async findManagerConfig(userId: string) {
    const [result] = await db.select().from(users).where(eq(users.id, userId));
    return result;
  }

  async create(data: SaleInsert) {
    const [newSale] = await db.insert(sales).values(data).returning();
    if (!newSale) throw new Error("Erro ao criar venda.");
    return newSale;
  }

  async listRecentSales(userId: string) {
    return await db
      .select({
        id: sales.id,
        sellerId: sales.sellerId,
        amount: sales.amount,
        date: sales.saleDate,
        description: sales.description,
        sellerName: sellers.name,
        sellerComm: sales.totalCommissionSeller,
        sellerFixed: sales.appliedSellerFixed,
        sellerPercent: sales.appliedSellerPercent,
        managerComm: sales.totalCommissionManager,
        managerFixed: sales.appliedManagerFixed,
        managerPercent: sales.appliedManagerPercent,
        ruleDescriptionSeller: sales.ruleDescriptionSeller,
        ruleDescriptionManager: sales.ruleDescriptionManager,
      })
      .from(sales)
      .innerJoin(sellers, eq(sales.sellerId, sellers.id))
      .where(eq(sellers.userId, userId))
      .orderBy(desc(sales.saleDate));
  }

  async checkOwnership(saleId: string, userId: string) {
    const [result] = await db
      .select({ id: sales.id })
      .from(sales)
      .innerJoin(sellers, eq(sales.sellerId, sellers.id))
      .where(and(eq(sales.id, saleId), eq(sellers.userId, userId)));
    return !!result;
  }

  async delete(saleId: string) {
    const [deleted] = await db
      .delete(sales)
      .where(eq(sales.id, saleId))
      .returning();
    if (!deleted) throw new Error("Erro ao deletar venda.");
    return deleted;
  }

  async findById(saleId: string) {
    const [result] = await db.select().from(sales).where(eq(sales.id, saleId));
    return result;
  }

  async update(saleId: string, data: Partial<SaleInsert>) {
    const [updated] = await db
      .update(sales)
      .set(data)
      .where(eq(sales.id, saleId))
      .returning();
    if (!updated) throw new Error("Erro ao atualizar venda.");
    return updated;
  }

  async filterSalesBySellerIdAndDateRange(
    userId: string,
    sellerId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const filters = [eq(sellers.userId, userId)];

    if (sellerId) {
      filters.push(eq(sales.sellerId, sellerId));
    }
    if (startDate) {
      filters.push(gte(sales.saleDate, startDate));
    }
    if (endDate) {
      filters.push(lte(sales.saleDate, endDate));
    }

    return await db
      .select({
        id: sales.id,
        sellerId: sales.sellerId,
        amount: sales.amount,
        date: sales.saleDate,
        description: sales.description,
        sellerName: sellers.name,
        sellerComm: sales.totalCommissionSeller,
        sellerFixed: sales.appliedSellerFixed,
        sellerPercent: sales.appliedSellerPercent,
        managerComm: sales.totalCommissionManager,
        managerFixed: sales.appliedManagerFixed,
        managerPercent: sales.appliedManagerPercent,
        ruleDescriptionSeller: sales.ruleDescriptionSeller,
        ruleDescriptionManager: sales.ruleDescriptionManager,
      })
      .from(sales)
      .innerJoin(sellers, eq(sales.sellerId, sellers.id))
      .where(and(...filters))
      .orderBy(desc(sales.saleDate));
  }
}
