import { type Context, Elysia } from "elysia";
import { auth } from "../lib/auth";

export const authMiddleware = (app: Elysia) =>
  app
    .macro(({ onBeforeHandle }) => ({
      auth(enabled: boolean) {
        if (!enabled) return;
        onBeforeHandle(async (ctx: Context) => {
          const session = await auth.api.getSession({
            headers: ctx.request.headers,
          });

          if (!session) {
            ctx.set.status = 401;
            return "Unauthorized";
          }
        });
      },
    }))
    .derive(async (ctx) => {
      const session = await auth.api.getSession({
        headers: ctx.request.headers,
      });

      return {
        user: session?.user ?? null,
        session: session?.session ?? null,
      };
    });
