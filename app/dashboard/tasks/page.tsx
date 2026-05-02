"use client";

import Link from "next/link";
import { LayoutGroup } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

import { DataTableSkeleton } from "@/components/dashboard/data-table-skeleton";
import { MotionTableRow } from "@/components/motion/motion-table-row";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { TasksKanbanBoard } from "@/components/tasks/tasks-kanban-board";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { TASK_PRIORITY_LABELS } from "@/lib/task-ui";
import type { TaskPriority } from "@/lib/models/types";
import { TASK_PRIORITIES } from "@/lib/models/types";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/lib/trpc/client";

type TaskFilterTab = "all" | "done" | "active";
type PriorityFilter = "all" | TaskPriority;
type ViewMode = "table" | "kanban";

function KanbanSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-[min(70vh,28rem)] min-w-[min(100vw-2rem,17rem)] shrink-0 rounded-2xl sm:min-w-[17.5rem]"
        />
      ))}
    </div>
  );
}

export default function TasksPage() {
  const trpc = useTRPC();
  const [filter, setFilter] = useState<TaskFilterTab>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [view, setView] = useState<ViewMode>("table");

  const { data, isLoading, error } = useQuery(
    trpc.task.all.queryOptions(undefined, { retry: false }),
  );

  const rows = data ?? [];

  const filteredRows = useMemo(() => {
    let list = rows;
    if (filter === "done") {
      list = list.filter((r) => r.status === "done");
    } else if (filter === "active") {
      list = list.filter((r) => r.status !== "done");
    }
    if (priorityFilter !== "all") {
      list = list.filter((r) => r.priority === priorityFilter);
    }
    return list;
  }, [rows, filter, priorityFilter]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">Workspace</p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Tasks
          </h1>
          <p className="mt-2 font-medium text-muted-foreground">
            Table with filters, or Kanban — drag cards between columns to update
            status.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <Link
            href="/dashboard/tasks/create"
            className={cn(buttonVariants(), "w-full justify-center sm:w-fit")}
          >
            Add task
          </Link>
          <Link
            href="/dashboard/projects"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-center sm:w-fit",
            )}
          >
            Browse projects
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div
          className="inline-flex w-full max-w-md gap-1 rounded-xl border-[0.5px] border-border/70 bg-muted/35 p-1 shadow-inner backdrop-blur-sm sm:w-auto"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => setView("table")}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:flex-initial sm:text-sm",
              view === "table"
                ? "bg-card text-foreground shadow-cozy"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <TableIcon className="size-4 shrink-0" aria-hidden />
            Table
          </button>
          <button
            type="button"
            onClick={() => setView("kanban")}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:flex-initial sm:text-sm",
              view === "kanban"
                ? "bg-card text-foreground shadow-cozy"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="size-4 shrink-0" aria-hidden />
            Kanban
          </button>
        </div>
      </div>

      {isLoading ? (
        view === "table" ? (
          <Card className="min-w-0 overflow-hidden bg-card">
            <CardContent className="min-w-0 pt-4 sm:pt-6">
              <DataTableSkeleton rows={8} columns={4} />
            </CardContent>
          </Card>
        ) : (
          <KanbanSkeleton />
        )
      ) : error ? (
        <p className="py-12 text-center text-sm font-bold text-destructive">
          {error.message || "Could not load tasks."}
        </p>
      ) : rows.length === 0 ? (
        <p className="py-12 text-center text-sm font-semibold text-muted-foreground">
          No tasks yet. Use the actions above to add a task or jump to your
          projects.
        </p>
      ) : view === "kanban" ? (
        <div className="min-w-0">
          <TasksKanbanBoard tasks={rows} />
        </div>
      ) : (
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as TaskFilterTab)}
          className="gap-4 sm:gap-6"
        >
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 sm:inline-flex sm:h-10 sm:w-fit sm:grid-cols-none">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="done">Completed</TabsTrigger>
            <TabsTrigger value="active">Not completed</TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p
              id="tasks-priority-filter-label"
              className="text-xs font-bold uppercase tracking-wide text-muted-foreground"
            >
              Priority
            </p>
            <NativeSelect
              size="sm"
              className="min-w-[10rem] sm:w-48"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as PriorityFilter)
              }
              aria-labelledby="tasks-priority-filter-label"
            >
              <NativeSelectOption value="all">All priorities</NativeSelectOption>
              {TASK_PRIORITIES.map((p) => (
                <NativeSelectOption key={p} value={p}>
                  {TASK_PRIORITY_LABELS[p]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <Card className="min-w-0 overflow-hidden bg-card">
            <CardContent className="min-w-0 pt-4 sm:pt-6">
              {filteredRows.length === 0 ? (
                <p className="py-10 text-center text-sm font-semibold text-muted-foreground sm:py-14">
                  No tasks match this filter.
                </p>
              ) : (
                <>
                  <div className="space-y-2 sm:hidden">
                    {filteredRows.map((row) => (
                      <div
                        key={row._id}
                        className="rounded-xl border border-border/60 bg-card/90 px-3 py-2.5 shadow-sm"
                      >
                        <p className="text-sm font-bold leading-snug">
                          {row.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-[11px] font-semibold"
                          >
                            {TASK_PRIORITY_LABELS[row.priority]}
                          </Badge>
                          <TaskStatusSelect
                            taskId={row._id}
                            status={row.status}
                          />
                        </div>
                        <p className="mt-2 text-[11px] font-medium text-muted-foreground tabular-nums">
                          {row.updatedAt
                            ? new Date(row.updatedAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block">
                    <LayoutGroup id="tasks-table">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-4">Name</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead className="min-w-[10rem]">Status</TableHead>
                            <TableHead className="pr-4 text-right">
                              Updated
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRows.map((row) => (
                            <MotionTableRow
                              key={row._id}
                              layout
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 38,
                              }}
                            >
                              <TableCell className="max-w-[min(100vw,14rem)] truncate pl-4 font-bold sm:max-w-none">
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="font-semibold"
                                >
                                  {TASK_PRIORITY_LABELS[row.priority]}
                                </Badge>
                              </TableCell>
                              <TableCell className="align-middle">
                                <TaskStatusSelect
                                  taskId={row._id}
                                  status={row.status}
                                />
                              </TableCell>
                              <TableCell className="pr-4 text-right font-semibold text-muted-foreground tabular-nums">
                                {row.updatedAt
                                  ? new Date(row.updatedAt).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                            </MotionTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </LayoutGroup>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  );
}
