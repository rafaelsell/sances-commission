import Decimal from "decimal.js";
import { SalesRepository } from "../repositories/sales.repository";
import type { CreateSaleDTO } from "../schemas/sales.schema";
import type { SaleInsert } from "@backend/db/schemas/sales";

export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  private calculateCommissionAndText = (
    amount: Decimal,
    fixedStr: string | null,
    percentStr: string | null,
  ): {
    total: string;
    usedFixed: string;
    usedPercent: string;
    text: string;
  } => {
    const fixed = new Decimal(fixedStr || 0);
    const percent = new Decimal(percentStr || 0);
    const percentCommission = amount.mul(percent.div(100));
    const total = fixed.plus(percentCommission);
    let description = "";
    if (total.greaterThan(0)) {
      description = `Total de comissão: ${total.toFixed(2)}. (`;

      let parts = [];
      if (fixed.greaterThan(0)) {
        parts.push(`${fixed.toFixed(2)} por veículo vendido.`);
      }
      if (percent.greaterThan(0)) {
        parts.push(
          `${percent.toFixed(2)}% do valor da venda (${percentCommission.toFixed(2)})`,
        );
      }

      description += parts.join(" ") + ")";
    }

    return {
      total: total.toFixed(2),
      usedFixed: fixed.toFixed(2),
      usedPercent: percent.toFixed(2),
      text: description,
    };
  };

  // === CREATE (A lógica principal) ===
  async registerSale(userId: string, data: CreateSaleDTO) {
    // 1. Validar Vendedor e Gerente
    const seller = await this.salesRepository.findSellerAndVerifyOwner(
      data.sellerId,
      userId,
    );
    if (!seller) throw new Error("Vendedor inválido.");

    const manager = await this.salesRepository.findManagerConfig(userId);
    if (!manager) throw new Error("Configuração de gerente não encontrada.");

    const amountDecimal = new Decimal(data.amount);

    // 2. Calcular Vendedor
    const sellerCalc = this.calculateCommissionAndText(
      amountDecimal,
      seller.fixedCommission,
      seller.percentageCommission,
    );

    // 3. Calcular Gerente
    const managerCalc = this.calculateCommissionAndText(
      amountDecimal,
      manager.managerFixedCommission,
      manager.managerPercentCommission,
    );

    // 4. Salvar (Persistir os dados puros)
    return await this.salesRepository.create({
      sellerId: data.sellerId,
      amount: data.amount.toString(),
      description: data.description,

      // Snapshot Vendedor
      appliedSellerFixed: sellerCalc.usedFixed,
      appliedSellerPercent: sellerCalc.usedPercent,
      totalCommissionSeller: sellerCalc.total,
      ruleDescriptionSeller: sellerCalc.text,

      // Snapshot Gerente
      appliedManagerFixed: managerCalc.usedFixed,
      appliedManagerPercent: managerCalc.usedPercent,
      totalCommissionManager: managerCalc.total,
      ruleDescriptionManager: managerCalc.text,
    });
  }

  // === LIST (Read) ===
  async listSales(
    userId: string,
    filters?: { sellerId?: string; startDate?: Date; endDate?: Date },
  ) {
    return await this.salesRepository.filterSalesBySellerIdAndDateRange(
      userId,
      filters?.sellerId,
      filters?.startDate,
      filters?.endDate,
    );
  }

  // === DELETE ===
  async deleteSale(userId: string, saleId: string) {
    // Verifica se a venda pertence a um vendedor DO usuário
    const exists = await this.salesRepository.checkOwnership(saleId, userId);
    if (!exists) throw new Error("Venda não encontrada ou não autorizada.");
    return await this.salesRepository.delete(saleId);
  }

  async updateSale(userId: string, saleId: string, data: Partial<SaleInsert>) {
    // 1. Verifica se a venda pertence a um vendedor DO usuário
    const exists = await this.salesRepository.checkOwnership(saleId, userId);
    if (!exists) throw new Error("Venda não encontrada ou não autorizada.");

    // 2. Busca a venda atual para pegar o sellerId e amount caso não venham no payload
    const currentSale = await this.salesRepository.findById(saleId);
    if (!currentSale) throw new Error("Venda não encontrada.");

    // 3. Determina os valores que serão usados (novo ou atual)
    const sellerIdToUse = data.sellerId || currentSale.sellerId;
    const amountToUse = data.amount
      ? new Decimal(data.amount)
      : new Decimal(currentSale.amount);

    // 4. Busca as regras do vendedor e do gerente para recalcular
    const seller = await this.salesRepository.findSellerAndVerifyOwner(
      sellerIdToUse,
      userId,
    );
    if (!seller) throw new Error("Vendedor inválido.");

    const manager = await this.salesRepository.findManagerConfig(userId);
    if (!manager) throw new Error("Configuração de gerente não encontrada.");

    // 5. Recalcula comissões
    const sellerCalc = this.calculateCommissionAndText(
      amountToUse,
      seller.fixedCommission,
      seller.percentageCommission,
    );

    const managerCalc = this.calculateCommissionAndText(
      amountToUse,
      manager.managerFixedCommission,
      manager.managerPercentCommission,
    );

    // 6. Prepara o payload de atualização mesclando dados e novos cálculos
    const updatePayload = {
      ...data,
      amount: amountToUse.toString(), // Garante que amount está atualizado se foi recalculado
      // Atualiza snapshots do Vendedor
      appliedSellerFixed: sellerCalc.usedFixed,
      appliedSellerPercent: sellerCalc.usedPercent,
      totalCommissionSeller: sellerCalc.total,
      ruleDescriptionSeller: sellerCalc.text,

      // Atualiza snapshots do Gerente
      appliedManagerFixed: managerCalc.usedFixed,
      appliedManagerPercent: managerCalc.usedPercent,
      totalCommissionManager: managerCalc.total,
      ruleDescriptionManager: managerCalc.text,
    };

    return await this.salesRepository.update(saleId, updatePayload);
  }
}
