import Elysia from "elysia";
import { SalesController } from "../controllers/sales.controller";
import { SalesRepository } from "../repositories/sales.repository";
import { SalesService } from "../services/sales.service";
import { authMiddleware } from "@backend/middlewares/auth-middleware";
import {
  createSaleResponseSchema,
  createSaleSchema,
  listSalesResponseSchema,
  updateSaleSchema,
} from "../schemas/sales.schema";
import { errorSchema } from "../schemas/errors.schema";
import z from "zod";

const salesRepo = new SalesRepository();
const salesService = new SalesService(salesRepo);
const salesController = new SalesController(salesService);

export const salesRoute = new Elysia({
  prefix: "/sales",
  tags: ["Sales"],
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ user, query, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      try {
        const sales = await salesController.list({
          userId: user.id,
          sellerId: query.sellerId,
          startDate: query.startDate,
          endDate: query.endDate,
        });
        set.status = 200;
        return sales.map((s) => ({
          ...s,
          date: s.date.toISOString(),
        }));
      } catch (err: any) {
        set.status = 500;
        return { message: "Erro interno ao processar venda." };
      }
    },
    {
      auth: true,
      query: z.object({
        sellerId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
      response: {
        200: listSalesResponseSchema,
        401: errorSchema,
        500: errorSchema,
      },
    },
  )
  .post(
    "/",
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      try {
        const sale = await salesController.create({
          body,
          userId: user.id,
        });
        set.status = 201;
        return {
          ...sale,
          saleDate: sale.saleDate.toISOString(),
        };
      } catch (err: any) {
        if (err.message.includes("Vendedor não encontrado")) {
          set.status = 400;
          return { message: err.message };
        }
        set.status = 500;
        return { message: "Erro interno ao processar venda." };
      }
    },
    {
      auth: true,
      body: createSaleSchema,
      response: {
        201: createSaleResponseSchema,
        400: errorSchema,
        401: errorSchema,
        500: errorSchema,
      },
    },
  )
  .delete(
    "/:saleId",
    async ({ user, params, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      try {
        const sale = await salesController.delete({
          saleId: params.saleId,
          userId: user.id,
        });
        set.status = 200;
        return {
          ...sale,
          saleDate: sale.saleDate.toISOString(),
        };
      } catch (err: any) {
        if (err.message.includes("Vendedor não encontrado")) {
          set.status = 400;
          return { message: err.message };
        }
        set.status = 500;
        return { message: "Erro interno ao processar venda." };
      }
    },
    {
      auth: true,
      params: z.object({
        saleId: z.string(),
      }),
      response: {
        200: createSaleResponseSchema,
        400: errorSchema,
        401: errorSchema,
        500: errorSchema,
      },
    },
  )
  .put(
    "/:saleId",
    async ({ user, params, body, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      try {
        const sale = await salesController.update({
          body,
          userId: user.id,
          saleId: params.saleId,
        });
        set.status = 200;
        return {
          ...sale,
          saleDate: sale.saleDate.toISOString(),
        };
      } catch (err: any) {
        if (err.message.includes("Vendedor não encontrado")) {
          set.status = 400;
          return { message: err.message };
        }
        set.status = 500;
        return { message: "Erro interno ao processar venda." };
      }
    },
    {
      auth: true,
      params: z.object({
        saleId: z.string(),
      }),
      body: updateSaleSchema,
      response: {
        200: createSaleResponseSchema,
        400: errorSchema,
        401: errorSchema,
        500: errorSchema,
      },
    },
  );
