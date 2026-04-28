import mongoose, { Schema, type Model } from "mongoose";

import {
  type ITask,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/models/types";

const taskSchema = new Schema<ITask, Model<ITask>>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    projectId: { type: Schema.Types.ObjectId, required: true, ref: "Project", index: true },
    status: {
      type: String,
      enum: TASK_STATUSES satisfies readonly TaskStatus[],
      default: "todo",
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES satisfies readonly TaskPriority[],
      default: "medium",
    },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

taskSchema.index({ userId: 1, projectId: 1 });

export const Task =
  (mongoose.models.Task as Model<ITask>) ?? mongoose.model<ITask>("Task", taskSchema);
