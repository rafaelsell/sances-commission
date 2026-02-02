import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8888),
  NODE_ENV: z.enum(["development", "production", "test"]),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  POSTGRES_DB: z.string().default("sances_commission"),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  DATABASE_URL: z
    .string()
    .default(
      "postgresql://postgres:postgres@localhost:5432/sances_commission?schema=public",
    ),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173,http://localhost:8888"),
});

export const env = envSchema.parse(process.env);
