import { SalesService } from "@backend/modules/services/sales.service";
import type {
  CreateSaleDTO,
  CreateSaleRequestDTO,
  UpdateSaleRequestDTO,
} from "../schemas/sales.schema";

export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  async list({
    userId,
    sellerId,
    startDate,
    endDate,
  }: {
    userId: string;
    sellerId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    return await this.salesService.listSales(userId, {
      sellerId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  async create({
    body,
    userId,
  }: {
    body: CreateSaleRequestDTO;
    userId: string;
  }) {
    try {
      const sale = await this.salesService.registerSale(userId, body);
      return sale;
    } catch (err: any) {
      if (err.message.includes("Vendedor não encontrado"))
        throw new Error(err.message);

      console.error(err);
      throw new Error("Erro interno ao processar venda.");
    }
  }

  async delete({ saleId, userId }: { saleId: string; userId: string }) {
    try {
      const sale = await this.salesService.deleteSale(userId, saleId);
      return sale;
    } catch (err: any) {
      if (err.message.includes("Vendedor não encontrado"))
        throw new Error(err.message);

      console.error(err);
      throw new Error("Erro interno ao processar venda.");
    }
  }

  async update({
    body,
    userId,
    saleId,
  }: {
    body: UpdateSaleRequestDTO;
    userId: string;
    saleId: string;
  }) {
    try {
      const sale = await this.salesService.updateSale(userId, saleId, {
        ...body,
        amount: body.amount?.toString(),
      });
      return sale;
    } catch (err: any) {
      if (err.message.includes("Vendedor não encontrado"))
        throw new Error(err.message);

      console.error(err);
      throw new Error("Erro interno ao processar venda.");
    }
  }
}
