import mongoose, { Schema, type Model } from "mongoose";

import {
  type IProject,
  PROJECT_STATUSES,
  type ProjectStatus,
} from "@/lib/models/types";

const projectSchema = new Schema<IProject, Model<IProject>>(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: PROJECT_STATUSES satisfies readonly ProjectStatus[],
      default: "planning",
    },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

projectSchema.index({ userId: 1, name: 1 });

export const Project =
  (mongoose.models.Project as Model<IProject>) ??
  mongoose.model<IProject>("Project", projectSchema);
