import type { ProjectStatus } from "@/lib/models/types";
import type { TaskPriority, TaskStatus } from "@/lib/models/types";

/** Plain JSON-safe task row for tRPC / React (no Mongoose ObjectId instances). */
export type SerializedTask = {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SerializedProject = {
  _id: string;
  name: string;
  status: ProjectStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeTaskLean(doc: unknown): SerializedTask {
  const d = doc as {
    _id: { toString(): string };
    name: string;
    description: string;
    projectId: { toString(): string };
    status: TaskStatus;
    priority: TaskPriority;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  return {
    _id: String(d._id),
    name: d.name,
    description: d.description,
    projectId: String(d.projectId),
    status: d.status,
    priority: d.priority,
    userId: d.userId,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export function serializeProjectLean(doc: unknown): SerializedProject {
  const d = doc as {
    _id: { toString(): string };
    name: string;
    status: ProjectStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  return {
    _id: String(d._id),
    name: d.name,
    status: d.status,
    userId: d.userId,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}
