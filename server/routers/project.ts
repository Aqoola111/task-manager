import { z } from "zod";

import { Project } from "@/lib/models";
import { serializeProjectLean } from "@/lib/serialize/task-project";
import { createProjectSchema } from "@/lib/validation/project";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  /** All projects for the signed-in user (newest first). */
  all: protectedProcedure.query(async ({ ctx }) => {
    const docs = await Project.find({ userId: ctx.user.id })
      .sort({ updatedAt: -1 })
      .lean();
    return docs.map((d) => serializeProjectLean(d));
  }),

  /** Most recently updated projects (for dashboard overview). */
  recent: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const docs = await Project.find({ userId: ctx.user.id })
        .sort({ updatedAt: -1 })
        .limit(input.limit)
        .lean();
      return docs.map((d) => serializeProjectLean(d));
    }),

  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const created = await Project.create({
        name: input.name,
        status: input.status,
        userId: ctx.user.id,
      });
      return serializeProjectLean(created.toObject());
    }),
});
