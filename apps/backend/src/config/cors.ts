import cors from "@elysiajs/cors";

export const corsPlugin = cors({
  origin: ["http://localhost:5173", "http://localhost:8888"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
