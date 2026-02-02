import { treaty } from "@elysiajs/eden";
import type { App } from "@app/backend/src/app";

export const api = treaty<App>("http://localhost:8888", {
  fetch: {
    credentials: "include",
  },
});
