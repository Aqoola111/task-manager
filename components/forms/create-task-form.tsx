"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useTRPC } from "@/lib/trpc/client";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/models/types";
import {
  PRIORITY_ITEMS,
  STATUS_ITEMS,
} from "@/lib/task-ui";
import {
  PROJECT_STATUS_SELECT_TRIGGER,
  projectRowSelectItemClass,
  TASK_PRIORITY_SELECT_ITEM,
  TASK_PRIORITY_SELECT_TRIGGER,
  TASK_STATUS_SELECT_ITEM,
  TASK_STATUS_SELECT_TRIGGER,
} from "@/lib/select-option-classes";
import { createTaskSchema, type CreateTaskInput } from "@/lib/validation/task";
import { cn } from "@/lib/utils";

/** Placeholder value so Select stays controlled (avoids uncontrolled → controlled warning). */
const PROJECT_NONE = "__project_none__";

export function CreateTaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const projects = useQuery(
    trpc.project.all.queryOptions(undefined, { retry: false }),
  );

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      projectId: "",
      status: "todo",
      priority: "medium",
    },
  });

  const create = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async (task) => {
        toast.success("Task created", {
          description: task.name,
        });
        await queryClient.invalidateQueries(trpc.task.all.queryFilter());
        await queryClient.invalidateQueries(trpc.task.recent.queryFilter());
        router.push("/dashboard/tasks");
        router.refresh();
      },
    }),
  );

  function onSubmit(data: CreateTaskInput) {
    create.mutate(data);
  }

  const projectRows = projects.data ?? [];
  const noProjects = !projects.isLoading && projectRows.length === 0;

  const projectItems = useMemo(() => {
    const m: Record<string, React.ReactNode> = {
      [PROJECT_NONE]: "Select a project",
    };
    for (const p of projectRows) {
      m[String(p._id)] = p.name;
    }
    return m;
  }, [projectRows]);

  return (
    <Card className="border-border bg-neo-pink">
      <CardHeader>
        <CardTitle>New task</CardTitle>
        <CardDescription>
          Choose an existing project, or create one first if you have none.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {projects.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-9 w-full rounded-sm" />
            <Skeleton className="h-9 w-full rounded-sm" />
            <Skeleton className="h-20 w-full rounded-sm" />
          </div>
        ) : noProjects ? (
          <div className="space-y-4 rounded-sm border-2 border-dashed border-border bg-neo-yellow/50 p-4">
            <p className="text-sm font-bold text-foreground">
              No projects yet — create a project before adding tasks.
            </p>
            <Link
              href="/dashboard/projects/create"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Create project
            </Link>
          </div>
        ) : (
          <form
            id="create-task-form"
            className="space-y-0"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="projectId"
                control={form.control}
                render={({ field, fieldState }) => {
                  const selectedProject = projectRows.find(
                    (p) => String(p._id) === field.value,
                  );
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Project</FieldLabel>
                      <Select
                        items={projectItems}
                        value={
                          field.value === "" ? PROJECT_NONE : field.value
                        }
                        onValueChange={(v) =>
                          field.onChange(v === PROJECT_NONE ? "" : v)
                        }
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            "w-full",
                            selectedProject &&
                              PROJECT_STATUS_SELECT_TRIGGER[
                                selectedProject.status
                              ],
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectRows.map((p) => (
                            <SelectItem
                              key={String(p._id)}
                              value={String(p._id)}
                              className={projectRowSelectItemClass(p.status)}
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Only projects you already created appear here.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-task-name">Title</FieldLabel>
                    <Input
                      {...field}
                      id="create-task-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ship onboarding refresh"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-task-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="create-task-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Optional context, links, or acceptance criteria."
                      rows={4}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      items={STATUS_ITEMS}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          "w-full",
                          TASK_STATUS_SELECT_TRIGGER[field.value],
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className={TASK_STATUS_SELECT_ITEM[s]}
                          >
                            {String(STATUS_ITEMS[s])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="priority"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Priority</FieldLabel>
                    <Select
                      items={PRIORITY_ITEMS}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          "w-full",
                          TASK_PRIORITY_SELECT_TRIGGER[field.value],
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITIES.map((p) => (
                          <SelectItem
                            key={p}
                            value={p}
                            className={TASK_PRIORITY_SELECT_ITEM[p]}
                          >
                            {String(PRIORITY_ITEMS[p])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {create.error && (
              <p className="mt-4 text-sm font-bold text-destructive" role="alert">
                {create.error.message}
              </p>
            )}
          </form>
        )}
      </CardContent>
      {!noProjects && !projects.isLoading ? (
        <CardFooter className="flex flex-wrap gap-3">
          <Button
            type="submit"
            form="create-task-form"
            disabled={create.isPending}
          >
            {create.isPending ? "Creating…" : "Create task"}
          </Button>
          <Link
            href="/dashboard/tasks"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "font-bold text-muted-foreground",
            )}
          >
            Cancel
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  );
}
