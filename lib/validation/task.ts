import * as z from "zod";

import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/models/types";

export const createTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(200, "Name is too long."),
  description: z.string().max(5000, "Description is too long."),
  projectId: z
    .string()
    .min(1, "Select a project.")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid project id."),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskStatusSchema = z.object({
  taskId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid task id."),
  status: z.enum(TASK_STATUSES),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
