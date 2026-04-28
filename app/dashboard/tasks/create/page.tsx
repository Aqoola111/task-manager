import Link from "next/link";

import { CreateTaskForm } from "@/components/forms/create-task-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateTaskPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted-foreground">Workspace</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Create task
          </h1>
          <p className="mt-2 max-w-xl font-semibold text-muted-foreground">
            Pick a project from your list, or create a project first if you have
            none.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/dashboard/tasks"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex w-full justify-center sm:w-auto",
            )}
          >
            Back to tasks
          </Link>
        </div>
      </header>

      <div className="w-full max-w-lg">
        <CreateTaskForm />
      </div>
    </div>
  );
}
