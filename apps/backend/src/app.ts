import { Elysia } from "elysia";
import { auth } from "./lib/auth";
import { corsPlugin } from "./config/cors";
import { openapiPlugin } from "./config/openapiPlugin";
import { authMiddleware } from "./middlewares/auth-middleware";
import { sellersRoute } from "@backend/modules/routes/sellers.route";
import { salesRoute } from "./modules/routes/sales.route";

export const app = new Elysia().use(corsPlugin).group("api", (app) =>
  app
    .use(openapiPlugin)
    .mount("auth", auth.handler)
    .use(authMiddleware)
    .use(sellersRoute)
    .use(salesRoute)
    .get("/", () => "API is running"),
);

export type App = typeof app;
