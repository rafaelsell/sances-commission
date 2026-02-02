import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8888",
  basePath: "/api/auth/api",
  plugins: [jwtClient()],
  user: {
    additionalFields: {
      managerFixedCommission: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      managerPercentCommission: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
    },
  },
});
