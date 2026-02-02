import { Elysia } from "elysia";
import { authMiddleware } from "@backend/middlewares/auth-middleware";
import { SellersRepository } from "@backend/modules/repositories/sellers.repository";
import { SellersService } from "@backend/modules/services/sellers.service";
import { SellersController } from "@backend/modules/controllers/seller.controller";
import {
  SellerCreateRequestSchema,
  SellerCreateResponseSchema,
  SellerDeleteResponseSchema,
  SellerListResponseSchema,
  SellerUpdateRequestSchema,
  SellerUpdateResponseSchema,
} from "@backend/modules/schemas/sellers.schema";
import z from "zod";

const sellersRepo = new SellersRepository();
const sellersService = new SellersService(sellersRepo);
const sellersController = new SellersController(sellersService);

export const sellersRoute = new Elysia({
  prefix: "/sellers",
  tags: ["Sellers"],
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      return sellersController.list({ userId: user.id });
    },
    {
      auth: true,
      detail: {
        description: "List all sellers from user",
        tags: ["Sellers"],
      },
      response: {
        200: z.array(SellerListResponseSchema),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
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
      return sellersController.create({ userId: user.id, body });
    },
    {
      detail: {
        description: "Create a new seller",
        tags: ["Sellers"],
      },
      response: {
        200: SellerCreateResponseSchema,
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
      },
      auth: true,
      body: SellerCreateRequestSchema,
    },
  )
  .put(
    "/:id",
    async ({ user, body, params: { id }, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      return sellersController.update({ userId: user.id, sellerId: id, body });
    },
    {
      auth: true,
      detail: {
        description: "Update a seller",
        tags: ["Sellers"],
      },
      params: z.object({
        id: z.string(),
      }),
      body: SellerUpdateRequestSchema,
      response: {
        200: SellerUpdateResponseSchema,
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
  )
  .delete(
    "/:id",
    async ({ user, params: { id }, set }) => {
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
      return sellersController.remove({ userId: user.id, sellerId: id });
    },
    {
      params: z.object({
        id: z.string(),
      }),
      auth: true,
      detail: {
        description: "Delete a seller",
        tags: ["Sellers"],
      },
      response: {
        200: SellerDeleteResponseSchema,
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
  );
