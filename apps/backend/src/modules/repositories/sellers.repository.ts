import { db } from "@backend/db";
import { sellers, type SellerInsert } from "@backend/db/schemas/sellers";
import { eq, and, desc } from "drizzle-orm";

export class SellersRepository {
  async findAllByUserId(userId: string) {
    return await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, userId))
      .orderBy(desc(sellers.createdAt));
  }

  async findByIdAndUserId(id: string, userId: string) {
    const [result] = await db
      .select()
      .from(sellers)
      .where(and(eq(sellers.id, id), eq(sellers.userId, userId)));
    return result;
  }

  async create(data: SellerInsert) {
    const [newSeller] = await db.insert(sellers).values(data).returning();
    if (!newSeller) {
      throw new Error("Failed to create seller");
    }
    return newSeller;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<typeof sellers.$inferInsert>,
  ) {
    const [updated] = await db
      .update(sellers)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(sellers.id, id), eq(sellers.userId, userId)))
      .returning();
    return updated;
  }

  async delete(id: string, userId: string) {
    const [deleted] = await db
      .delete(sellers)
      .where(and(eq(sellers.id, id), eq(sellers.userId, userId)))
      .returning();
    return deleted;
  }
}
