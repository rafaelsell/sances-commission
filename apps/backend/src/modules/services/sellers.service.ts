import { SellersRepository } from "@backend/modules/repositories/sellers.repository";
import type {
  CreateSellerDTO,
  UpdateSellerDTO,
} from "@backend/modules/schemas/sellers.schema";

export class SellersService {
  constructor(private readonly sellersRepository: SellersRepository) {}
  async listSellers(userId: string) {
    return await this.sellersRepository.findAllByUserId(userId);
  }
  async createSeller(userId: string, data: CreateSellerDTO) {
    return await this.sellersRepository.create({
      userId,
      name: data.name,
      email: data.email,
      fixedCommission: data.fixedCommission.toString(),
      percentageCommission: data.percentageCommission.toString(),
    });
  }

  async updateSeller(userId: string, sellerId: string, data: UpdateSellerDTO) {
    const exists = await this.sellersRepository.findByIdAndUserId(
      sellerId,
      userId,
    );
    if (!exists) throw new Error("Vendedor não encontrado.");
    const updated = await this.sellersRepository.update(sellerId, userId, {
      name: data.name,
      email: data.email,
      fixedCommission: data.fixedCommission?.toString(),
      percentageCommission: data.percentageCommission?.toString(),
    });
    if (!updated) throw new Error("Erro ao atualizar vendedor.");
    return updated;
  }

  async removeSeller(userId: string, sellerId: string) {
    const deleted = await this.sellersRepository.delete(sellerId, userId);
    if (!deleted) throw new Error("Vendedor não encontrado.");
    return deleted;
  }
}
