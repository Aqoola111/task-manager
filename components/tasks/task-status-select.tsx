"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskStatus } from "@/lib/models/types";
import { TASK_STATUSES } from "@/lib/models/types";
import {
  TASK_STATUS_SELECT_ITEM,
  TASK_STATUS_SELECT_TRIGGER,
} from "@/lib/select-option-classes";
import { STATUS_ITEMS } from "@/lib/task-ui";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export function TaskStatusSelect({
  taskId,
  status,
  disabled,
}: {
  taskId: string;
  status: TaskStatus;
  disabled?: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const update = useMutation(
    trpc.task.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.task.all.queryFilter());
        await queryClient.invalidateQueries(trpc.task.recent.queryFilter());
      },
    }),
  );

  return (
    <Select
      items={STATUS_ITEMS}
      value={status}
      onValueChange={(v) => {
        const next = v as TaskStatus;
        if (next !== status) {
          update.mutate({ taskId, status: next });
        }
      }}
      disabled={disabled ?? update.isPending}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          "h-8 min-w-[9rem] max-w-[min(100%,11rem)] border-2 text-xs shadow-none sm:min-w-[10rem] sm:text-sm",
          TASK_STATUS_SELECT_TRIGGER[status],
        )}
        aria-busy={update.isPending}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TASK_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className={TASK_STATUS_SELECT_ITEM[s]}>
            {String(STATUS_ITEMS[s])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
