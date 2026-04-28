import type { VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { PROJECT_STATUS_LABELS } from "@/lib/project-ui";
import type { ProjectStatus } from "@/lib/models/types";
import { TASK_STATUS_LABELS } from "@/lib/task-ui";
import type { TaskStatus } from "@/lib/models/types";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const taskStatusVariant: Partial<Record<TaskStatus, BadgeVariant>> = {
  done: "secondary",
  cancelled: "destructive",
  in_progress: "default",
  todo: "outline",
};

const projectStatusVariant: Partial<Record<ProjectStatus, BadgeVariant>> = {
  archived: "outline",
  active: "default",
  planning: "secondary",
};

function titleCaseFallback(raw: string) {
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({
  status,
  variant = "task",
}: {
  status: string;
  variant?: "task" | "project";
}) {
  if (variant === "project") {
    const ps = status as ProjectStatus;
    const label = PROJECT_STATUS_LABELS[ps] ?? titleCaseFallback(status);
    const v = projectStatusVariant[ps] ?? "outline";
    return (
      <Badge variant={v} className="font-semibold">
        {label}
      </Badge>
    );
  }

  const ts = status as TaskStatus;
  const label = TASK_STATUS_LABELS[ts] ?? titleCaseFallback(status);
  const v = taskStatusVariant[ts] ?? "outline";
  return (
    <Badge variant={v} className="font-semibold">
      {label}
    </Badge>
  );
}
