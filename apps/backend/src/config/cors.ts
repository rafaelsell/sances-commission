import cors from "@elysiajs/cors";

import { env } from "./env";

export const corsPlugin = cors({
  origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
