import { createTRPCContext } from "@/server/context";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

import { projectRouter } from "./project";
import { taskRouter } from "./task";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ ok: true as const })),
  project: projectRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;

export async function createServerCaller(req: Request) {
  const ctx = await createTRPCContext({ req });
  return appRouter.createCaller(ctx);
}
