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
import { LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { SerializedTask } from "@/lib/serialize/task-project";
import type { TaskPriority, TaskStatus } from "@/lib/models/types";
import { TASK_STATUSES } from "@/lib/models/types";
import { toast } from "sonner";

import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/task-ui";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

const PRIORITY_DOT: Record<TaskPriority, string> = {
  low: "bg-slate-400/80 dark:bg-slate-500/90",
  medium: "bg-sky-400/80 dark:bg-sky-500/90",
  high: "bg-amber-400/85 dark:bg-amber-500/90",
  urgent: "bg-rose-400/90 dark:bg-rose-500/90",
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
      <p className="font-medium leading-snug text-foreground">{task.name}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              PRIORITY_DOT[task.priority],
            )}
            title={TASK_PRIORITY_LABELS[task.priority]}
          />
          <span className="text-[11px] font-medium text-primary/75 dark:text-primary/80">
            {TASK_PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground/80 tabular-nums">
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
    <motion.div
      ref={setNodeRef}
      style={style}
      layout={!isDragging}
      layoutId={isDragging ? undefined : `kanban-task-${task._id}`}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className={cn(
        "touch-none rounded-xl border-0 bg-card p-3 shadow-cozy transition-opacity duration-200 card-cozy-hover",
        isDragging ? "opacity-30" : "opacity-100",
        "cursor-grab active:cursor-grabbing",
      )}
      {...listeners}
      {...attributes}
    >
      <KanbanCardFace task={task} />
    </motion.div>
  );
}

function KanbanColumn({
  status,
  tasks,
  isDragging,
}: {
  status: TaskStatus;
  tasks: SerializedTask[];
  isDragging: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId(status),
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[min(70vh,26rem)] min-w-[min(100vw-2rem,16rem)] shrink-0 flex-col sm:min-w-[17rem]",
        isOver &&
          isDragging &&
          "rounded-2xl ring-1 ring-primary/15 ring-offset-2 ring-offset-background",
      )}
    >
      <div className="border-b-[0.5px] border-border/50 pb-3">
        <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {TASK_STATUS_LABELS[status]}
        </h3>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground/70">
          {tasks.length} task{tasks.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-3">
        {tasks.length === 0 && !(isOver && isDragging) ? (
          <p className="py-8 text-center text-[11px] font-medium text-muted-foreground/80">
            Drop tasks here
          </p>
        ) : (
          tasks.map((t) => <KanbanTaskCard key={t._id} task={t} />)
        )}
        {isOver && isDragging ? (
          <div
            className="min-h-14 shrink-0 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] dark:bg-primary/[0.08]"
            aria-hidden
          />
        ) : null}
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
        toast.success("Task updated", {
          description: `${updated.name} → ${TASK_STATUS_LABELS[updated.status]}`,
        });
        queryClient.setQueryData(allQueryOpts.queryKey, (old) => {
          if (!old) return old;
          return old.map((t) => (t._id === updated._id ? updated : t));
        });
        await queryClient.invalidateQueries(trpc.task.recent.queryFilter());
      },
    }),
  );

  const isDragging = activeTask !== null;

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
      <LayoutGroup id="tasks-kanban">
        <div className="flex gap-6 overflow-x-auto pb-2 sm:gap-8">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={grouped[status]}
              isDragging={isDragging}
            />
          ))}
        </div>
      </LayoutGroup>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="cursor-grabbing rounded-xl border-0 bg-card p-3 shadow-cozy-md backdrop-blur-sm">
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
