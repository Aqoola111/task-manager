import type { ReactNode } from "react";

import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/models/types";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  archived: "Archived",
};

export const PROJECT_STATUS_ITEMS: Record<string, ReactNode> =
  Object.fromEntries(
    PROJECT_STATUSES.map((s) => [s, PROJECT_STATUS_LABELS[s]]),
  );
