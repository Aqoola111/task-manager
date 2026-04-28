"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import type { SerializedTask } from "@/lib/serialize/task-project";
import type { TaskStatus } from "@/lib/models/types";
import { TASK_STATUSES } from "@/lib/models/types";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/task-ui";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

const COLUMN_SURFACE: Record<TaskStatus, string> = {
  todo:
    "border-slate-300/75 bg-slate-50/95 dark:border-white/12 dark:bg-muted/55",
  in_progress:
    "border-sky-300/75 bg-sky-50/95 dark:border-sky-400/25 dark:bg-sky-950/40",
  done:
    "border-emerald-300/75 bg-emerald-50/95 dark:border-emerald-400/22 dark:bg-emerald-950/35",
  cancelled:
    "border-rose-300/75 bg-rose-50/95 dark:border-rose-400/22 dark:bg-rose-950/35",
};

function columnId(status: TaskStatus) {
  return `column:${status}`;
}

function draggableTaskId(id: string) {
  return `task:${id}`;
}

const collisionDetection: CollisionDetection = (args) => {
  const pointer = pointerWithin(args);
  if (pointer.length > 0) {
    return pointer;
  }
  return closestCorners(args);
};

function resolveDropTarget(
  overId: string | undefined,
  tasks: SerializedTask[],
): TaskStatus | null {
  if (!overId) return null;
  if (overId.startsWith("column:")) {
    return overId.replace("column:", "") as TaskStatus;
  }
  if (overId.startsWith("task:")) {
    const oid = overId.replace("task:", "");
    return tasks.find((t) => t._id === oid)?.status ?? null;
  }
  return null;
}

function KanbanCardFace({ task }: { task: SerializedTask }) {
  return (
    <>
      <p className="font-bold leading-snug">{task.name}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-[10px] font-semibold">
          {TASK_PRIORITY_LABELS[task.priority]}
        </Badge>
        <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
          {task.updatedAt
            ? new Date(task.updatedAt).toLocaleDateString()
            : ""}
        </span>
      </div>
    </>
  );
}

function KanbanTaskCard({ task }: { task: SerializedTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableTaskId(task._id),
      data: { task },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none rounded-sm border-2 border-border bg-card p-3 shadow-[3px_3px_0_0_var(--border)]",
        isDragging ? "opacity-40" : "opacity-100",
        "cursor-grab active:cursor-grabbing",
      )}
      {...listeners}
      {...attributes}
    >
      <KanbanCardFace task={task} />
    </div>
  );
}

function KanbanColumn({
  status,
  tasks,
}: {
  status: TaskStatus;
  tasks: SerializedTask[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId(status),
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[min(70vh,28rem)] min-w-[min(100vw-2rem,17rem)] shrink-0 flex-col rounded-sm border-2 sm:min-w-[17.5rem]",
        COLUMN_SURFACE[status],
        isOver && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background",
      )}
    >
      <div className="border-b-2 border-border/60 px-3 py-2">
        <h3 className="text-xs font-black uppercase tracking-wide">
          {TASK_STATUS_LABELS[status]}
        </h3>
        <p className="text-[10px] font-semibold text-muted-foreground">
          {tasks.length} task{tasks.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {tasks.length === 0 ? (
          <p className="py-6 text-center text-xs font-semibold text-muted-foreground">
            Drop tasks here
          </p>
        ) : (
          tasks.map((t) => <KanbanTaskCard key={t._id} task={t} />)
        )}
      </div>
    </div>
  );
}

export function TasksKanbanBoard({ tasks }: { tasks: SerializedTask[] }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const allQueryOpts = trpc.task.all.queryOptions(undefined);
  const [activeTask, setActiveTask] = useState<SerializedTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, SerializedTask[]> = {
      todo: [],
      in_progress: [],
      done: [],
      cancelled: [],
    };
    for (const t of tasks) {
      g[t.status].push(t);
    }
    for (const k of TASK_STATUSES) {
      g[k].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }
    return g;
  }, [tasks]);

  const updateStatus = useMutation(
    trpc.task.updateStatus.mutationOptions({
      onMutate: async ({ taskId, status }) => {
        await queryClient.cancelQueries(trpc.task.all.queryFilter());
        const previous = queryClient.getQueryData<SerializedTask[]>(
          allQueryOpts.queryKey,
        );
        queryClient.setQueryData(allQueryOpts.queryKey, (old) => {
          if (!old) return old;
          const now = new Date();
          return old.map((t) =>
            t._id === taskId ? { ...t, status, updatedAt: now } : t,
          );
        });
        return { previous };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) {
          queryClient.setQueryData(allQueryOpts.queryKey, ctx.previous);
        }
      },
      onSuccess: async (updated) => {
        queryClient.setQueryData(allQueryOpts.queryKey, (old) => {
          if (!old) return old;
          return old.map((t) => (t._id === updated._id ? updated : t));
        });
        await queryClient.invalidateQueries(trpc.task.recent.queryFilter());
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (!id.startsWith("task:")) return;
    const raw = id.replace("task:", "");
    const task = tasks.find((t) => t._id === raw);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const activeStr = String(event.active.id);
    if (!activeStr.startsWith("task:")) return;
    const tid = activeStr.replace("task:", "");
    const task = tasks.find((t) => t._id === tid);
    if (!task) return;

    const overId = event.over?.id != null ? String(event.over.id) : undefined;
    const nextStatus = resolveDropTarget(overId, tasks);
    if (!nextStatus || nextStatus === task.status) return;

    updateStatus.mutate({ taskId: tid, status: nextStatus });
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="cursor-grabbing rounded-sm border-2 border-border bg-card p-3 shadow-[5px_5px_0_0_var(--border)]">
            <KanbanCardFace task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>

      {updateStatus.isPending ? (
        <p className="sr-only" aria-live="polite">
          Updating task status…
        </p>
      ) : null}
    </DndContext>
  );
}
