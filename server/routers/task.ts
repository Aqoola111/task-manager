import { TRPCError } from "@trpc/server";
import { Types } from "mongoose";
import { z } from "zod";

import { Project, Task } from "@/lib/models";
import {
  serializeTaskLean,
} from "@/lib/serialize/task-project";
import {
  createTaskSchema,
  updateTaskStatusSchema,
} from "@/lib/validation/task";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  /** All tasks for the signed-in user (newest first). */
  all: protectedProcedure.query(async ({ ctx }) => {
    const docs = await Task.find({ userId: ctx.user.id })
      .sort({ updatedAt: -1 })
      .lean();
    return docs.map((d) => serializeTaskLean(d));
  }),

  /** Most recently updated tasks (for dashboard overview). */
  recent: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const docs = await Task.find({ userId: ctx.user.id })
        .sort({ updatedAt: -1 })
        .limit(input.limit)
        .lean();
      return docs.map((d) => serializeTaskLean(d));
    }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const owns = await Project.exists({
        _id: new Types.ObjectId(input.projectId),
        userId: ctx.user.id,
      });
      if (!owns) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      const created = await Task.create({
        name: input.name,
        description: input.description,
        projectId: new Types.ObjectId(input.projectId),
        status: input.status,
        priority: input.priority,
        userId: ctx.user.id,
      });
      return serializeTaskLean(created.toObject());
    }),

  updateStatus: protectedProcedure
    .input(updateTaskStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const updated = await Task.findOneAndUpdate(
        {
          _id: new Types.ObjectId(input.taskId),
          userId: ctx.user.id,
        },
        { $set: { status: input.status } },
        { new: true },
      ).lean();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }

      return serializeTaskLean(updated);
    }),
});
