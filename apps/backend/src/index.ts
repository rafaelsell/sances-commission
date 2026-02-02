import { env } from "@backend/config/env";
import { app } from "./app";

app.listen(env.PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/api, docs at http://${app.server?.hostname}:${app.server?.port}/api/docs`,
);
