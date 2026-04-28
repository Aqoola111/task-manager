import "server-only";

import { connectMongoose } from "@/lib/db/mongoose";
import { getAuth } from "@/lib/auth";

/**
 * Pass `{ req }` from the fetch adapter (API route) or `{ headers }` from `next/headers` (RSC).
 * @see https://trpc.io/docs/client/nextjs/app-router-setup
 */
export async function createTRPCContext(
  opts: { req: Request } | { headers: Headers },
) {
  await connectMongoose();
  const auth = await getAuth();
  const headers = "req" in opts ? opts.req.headers : opts.headers;
  const session = await auth.api.getSession({ headers });

  return {
    session,
    headers,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
