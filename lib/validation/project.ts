import * as z from "zod";

import { PROJECT_STATUSES } from "@/lib/models/types";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name is too long."),
  status: z.enum(PROJECT_STATUSES),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
