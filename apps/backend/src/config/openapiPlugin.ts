import { OpenAPI } from "@backend/lib/auth";
import openapi from "@elysiajs/openapi";
import z from "zod";

export const openapiPlugin = openapi({
  path: "/docs",
  mapJsonSchema: {
    zod: z.toJSONSchema,
  },
  documentation: {
    components: await OpenAPI.components,
    paths: await OpenAPI.getPaths(),
    tags: [{ name: "App", description: "General endpoints" }],
    info: {
      title: "Sances Commission API",
      version: "1.0.0",
      description: "API for Sances Commission application",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "/api",
      },
    ],
  },
});
