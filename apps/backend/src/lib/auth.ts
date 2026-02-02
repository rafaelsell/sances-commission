import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@backend/db";
import { env } from "@backend/config/env";
import { users } from "@backend/db/schemas/users";
import { accounts } from "@backend/db/schemas/accounts";
import { sessions } from "@backend/db/schemas/sessions";
import { verifications } from "@backend/db/schemas/verifications";
import { jwkss } from "@backend/db/schemas/jwkss";
import {
  accountsRelations,
  sessionsRelations,
  usersRelations,
} from "@backend/db/schemas/relations";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [jwt(), openAPI()],
  basePath: "/auth/api",
  advanced: {
    database: {
      generateId: false,
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:8888"],
  database: drizzleAdapter(db, {
    provider: "pg",
    camelCase: false,
    usePlural: true,
    schema: {
      users,
      accounts,
      sessions,
      verifications,
      jwkss,
      accountsRelations,
      sessionsRelations,
      usersRelations,
    },
  }),
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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path]!;

        for (const method of Object.keys(paths[path]!)) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
