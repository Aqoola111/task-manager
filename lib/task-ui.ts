import type { ReactNode } from "react";

import type { TaskPriority, TaskStatus } from "@/lib/models/types";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/models/types";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
  cancelled: "Cancelled",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const STATUS_ITEMS: Record<string, ReactNode> = Object.fromEntries(
  TASK_STATUSES.map((s) => [s, TASK_STATUS_LABELS[s]]),
);

export const PRIORITY_ITEMS: Record<string, ReactNode> = Object.fromEntries(
  TASK_PRIORITIES.map((p) => [p, TASK_PRIORITY_LABELS[p]]),
);
