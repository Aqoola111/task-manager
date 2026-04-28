"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";

import { useTRPC } from "@/lib/trpc/client";
import { PROJECT_STATUSES } from "@/lib/models/types";
import { PROJECT_STATUS_ITEMS } from "@/lib/project-ui";
import {
  PROJECT_STATUS_SELECT_ITEM,
  PROJECT_STATUS_SELECT_TRIGGER,
} from "@/lib/select-option-classes";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validation/project";
import { cn } from "@/lib/utils";

export function CreateProjectForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      status: "planning",
    },
  });

  const create = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: async (project) => {
        toast.success("Project created", {
          description: project.name,
        });
        await queryClient.invalidateQueries(trpc.project.all.queryFilter());
        await queryClient.invalidateQueries(trpc.project.recent.queryFilter());
        router.push("/dashboard/projects");
        router.refresh();
      },
    }),
  );

  function onSubmit(data: CreateProjectInput) {
    create.mutate(data);
  }

  return (
    <Card className="border-border bg-neo-mint">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>
          Name your workspace and pick an initial status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-project-form"
          className="space-y-0"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-project-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="create-project-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Quarterly roadmap"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Shown in lists and on the dashboard.
                  </FieldDescription>
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
                  <FieldLabel htmlFor="create-project-status">Status</FieldLabel>
                  <Select
                    items={PROJECT_STATUS_ITEMS}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="create-project-status"
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        "w-full",
                        PROJECT_STATUS_SELECT_TRIGGER[field.value],
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUSES.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className={PROJECT_STATUS_SELECT_ITEM[s]}
                        >
                          {String(PROJECT_STATUS_ITEMS[s])}
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
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button
          type="submit"
          form="create-project-form"
          disabled={create.isPending}
        >
          {create.isPending ? "Creating…" : "Create project"}
        </Button>
        <Link
          href="/dashboard/projects"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "text-base font-bold text-muted-foreground",
          )}
        >
          Cancel
        </Link>
      </CardFooter>
    </Card>
  );
}
