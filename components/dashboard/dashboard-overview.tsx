"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, ListTodo, Sparkles } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionTableRow } from "@/components/motion/motion-table-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TASK_PRIORITY_LABELS } from "@/lib/task-ui";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

const overviewQueryOpts = { retry: false as const };
const RECENT_TASKS_LIMIT = 10;

function StatMini({
  label,
  value,
  loading,
}: {
  label: string;
  value: number | null;
  loading: boolean;
}) {
  return (
    <Card
      size="sm"
      className="border-0 bg-card py-2"
    >
      <CardHeader className="space-y-0.5 px-3 py-0 pb-1">
        <CardDescription className="text-[10px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
          {label}
        </CardDescription>
        <CardTitle className="text-xl font-medium tabular-nums leading-none">
          {loading ? (
            <Skeleton className="h-7 w-10 rounded-sm" />
          ) : (
            (value ?? "—")
          )}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-sm" />
      ))}
    </div>
  );
}

export function DashboardOverview() {
  const trpc = useTRPC();

  const projectsAll = useQuery(
    trpc.project.all.queryOptions(undefined, overviewQueryOpts),
  );
  const tasksAll = useQuery(
    trpc.task.all.queryOptions(undefined, overviewQueryOpts),
  );
  const recentProjectsQuery = useQuery(
    trpc.project.recent.queryOptions({ limit: 5 }, overviewQueryOpts),
  );
  const recentTasksQuery = useQuery(
    trpc.task.recent.queryOptions(
      { limit: RECENT_TASKS_LIMIT },
      overviewQueryOpts,
    ),
  );

  const tasks = tasksAll.data ?? [];
  const recentProjects = recentProjectsQuery.data ?? [];
  const recentTasks = recentTasksQuery.data ?? [];

  const stats = useMemo(() => {
    if (!tasksAll.data) {
      return { total: null as number | null, done: null, inProgress: null };
    }
    return {
      total: tasks.length,
      done: tasks.filter((t) => t.status === "done").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
    };
  }, [tasks, tasksAll.data]);

  /** Todo + in progress — work still on your plate (distinct from mini stats). */
  const activeTaskCount = useMemo(() => {
    if (!tasksAll.data) return null as number | null;
    return tasks.filter(
      (t) => t.status === "todo" || t.status === "in_progress",
    ).length;
  }, [tasks, tasksAll.data]);

  const projectCount = projectsAll.isLoading
    ? null
    : (projectsAll.data?.length ?? 0);

  const loadingTasks = tasksAll.isLoading;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="relative overflow-hidden rounded-2xl border-0 bg-card px-4 py-6 shadow-cozy backdrop-blur-sm sm:px-8 sm:py-8 md:px-10 md:py-10">
        <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
              <Sparkles className="size-3.5 shrink-0" aria-hidden />
              Overview
            </div>
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
              Task Management Dashboard
            </h1>
            <p className="max-w-xl font-medium text-muted-foreground">
              Track projects and tasks with calm clarity.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              href="/dashboard/projects/create"
              className={cn(
                buttonVariants(),
                "w-full justify-center sm:w-auto sm:justify-start",
              )}
            >
              New project
            </Link>
            <Link
              href="/dashboard/tasks/create"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-center sm:w-auto sm:justify-start",
              )}
            >
              New task
            </Link>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:gap-3">
        <StatMini
          label="Total tasks"
          value={stats.total}
          loading={loadingTasks}
        />
        <StatMini
          label="Completed"
          value={stats.done}
          loading={loadingTasks}
        />
        <StatMini
          label="In progress"
          value={stats.inProgress}
          loading={loadingTasks}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="border-0 bg-card">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderKanban className="size-4" aria-hidden />
                Projects
              </CardTitle>
              <CardDescription>Total in your workspace</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-medium tabular-nums tracking-tight">
              {projectsAll.isLoading ? (
                <Skeleton className="h-9 w-14 rounded-lg" />
              ) : (
                projectCount ?? "—"
              )}
            </p>
          </CardContent>
          <CardContent className="pt-0">
            <Link
              href="/dashboard/projects"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View all projects
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListTodo className="size-4" aria-hidden />
                Tasks
              </CardTitle>
              <CardDescription>
                Todo and in progress — still on your plate
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-medium tabular-nums tracking-tight">
              {tasksAll.isLoading ? (
                <Skeleton className="h-9 w-14 rounded-lg" />
              ) : (
                activeTaskCount ?? "—"
              )}
            </p>
          </CardContent>
          <CardContent className="pt-0">
            <Link
              href="/dashboard/tasks"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View all tasks
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-lg font-medium tracking-tight">Latest tasks</h2>
        <Card className="min-w-0 overflow-hidden bg-card">
          <CardContent className="min-w-0 pt-4">
            {recentTasksQuery.isLoading ? (
              <TableSkeleton rows={6} />
            ) : recentTasks.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-muted-foreground">
                No tasks yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-4 text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTasks.map((row) => (
                    <MotionTableRow
                      key={String(row._id)}
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 38,
                      }}
                    >
                      <TableCell className="max-w-[180px] truncate pl-4 font-medium">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {TASK_PRIORITY_LABELS[row.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant="task" status={row.status} />
                      </TableCell>
                      <TableCell className="pr-4 text-right font-semibold text-muted-foreground tabular-nums text-xs">
                        {row.updatedAt
                          ? new Date(row.updatedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-lg font-medium tracking-tight">
          Recent projects
        </h2>
        <Card className="min-w-0 overflow-hidden border-0 bg-card">
          <CardContent className="min-w-0 pt-4">
            {recentProjectsQuery.isLoading ? (
              <TableSkeleton rows={4} />
            ) : recentProjects.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-muted-foreground">
                No projects yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-4 text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((row) => (
                    <MotionTableRow
                      key={String(row._id)}
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 38,
                      }}
                    >
                      <TableCell className="max-w-[140px] truncate pl-4 font-bold">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant="project" status={row.status} />
                      </TableCell>
                      <TableCell className="pr-4 text-right font-semibold text-muted-foreground tabular-nums text-xs">
                        {row.updatedAt
                          ? new Date(row.updatedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
