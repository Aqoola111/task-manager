import type { Types } from "mongoose";

/** Matches Better Auth `session.user.id` (string IDs, not necessarily ObjectId). */
export type AuthUserId = string;

export const PROJECT_STATUSES = ["active", "archived", "planning"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = ["todo", "in_progress", "done", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface IProject {
  name: string;
  status: ProjectStatus;
  userId: AuthUserId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  name: string;
  description: string;
  projectId: Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  userId: AuthUserId;
  createdAt: Date;
  updatedAt: Date;
}
