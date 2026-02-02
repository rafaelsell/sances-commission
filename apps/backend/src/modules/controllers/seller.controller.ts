import { SellersService } from "@backend/modules/services/sellers.service";
import type {
  CreateSellerDTO,
  UpdateSellerDTO,
} from "@backend/modules/schemas/sellers.schema";

export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  async list({ userId }: { userId: string }) {
    return await this.sellersService.listSellers(userId);
  }

  async create({ userId, body }: { userId: string; body: CreateSellerDTO }) {
    const seller = await this.sellersService.createSeller(userId, body);
    return seller;
  }

  async update({
    body,
    sellerId,
    userId,
  }: {
    userId: string;
    sellerId: string;
    body: UpdateSellerDTO;
  }) {
    const seller = await this.sellersService.updateSeller(
      userId,
      sellerId,
      body,
    );
    return seller;
  }

  async remove({ sellerId, userId }: { userId: string; sellerId: string }) {
    const seller = await this.sellersService.removeSeller(userId, sellerId);
    return seller;
  }
}
