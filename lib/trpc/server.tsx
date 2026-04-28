import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { headers } from "next/headers";

import { createTRPCContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";

import { makeQueryClient } from "./query-client";

/**
 * One `QueryClient` per request (RSC prefetch + dehydrate).
 * @see https://trpc.io/docs/client/nextjs/app-router-setup#create-a-trpc-caller-for-server-components
 */
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () =>
    createTRPCContext({
      headers: await headers(),
    }),
  router: appRouter,
  queryClient: getQueryClient,
});
