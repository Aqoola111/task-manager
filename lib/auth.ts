import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { connectMongoose, getMongoDb } from "@/lib/db/mongoose";

type AuthInstance = ReturnType<typeof betterAuth>;

let authCache: AuthInstance | null = null;

export async function getAuth(): Promise<AuthInstance> {
  if (authCache) {
    return authCache;
  }

  await connectMongoose();
  const db = getMongoDb();

  const rawBase =
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const baseURL = (() => {
    try {
      return new URL(rawBase).origin;
    } catch {
      return rawBase.replace(/\/+$/, "");
    }
  })();

  const instance = betterAuth({
    database: mongodbAdapter(db, {
      transaction: false,
    }),
    emailAndPassword: { enabled: true },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL,
    trustedOrigins: baseURL ? [baseURL] : undefined,
    plugins: [nextCookies()],
    /** Required for change-email flows when verification email is not wired to SMTP. */
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        if (process.env.NODE_ENV === "development") {
          console.info(
            `[better-auth] Verification email for ${user.email}: ${url}`,
          );
        }
      },
    },
    user: {
      changeEmail: {
        enabled: true,
        /** Lets unverified accounts switch email without mail transport (dev / first-time users). */
        updateEmailWithoutVerification: true,
        /** Required when session email is verified — logs link in development. */
        sendChangeEmailConfirmation: async ({ newEmail, url }) => {
          if (process.env.NODE_ENV === "development") {
            console.info(
              `[better-auth] Confirm email change to ${newEmail}: ${url}`,
            );
          }
        },
      },
    },
  }) as unknown as AuthInstance;

  authCache = instance;
  return instance;
}
