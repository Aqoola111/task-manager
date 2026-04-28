import Link from "next/link";

import { CreateProjectForm } from "@/components/forms/create-project-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateProjectPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted-foreground">Workspace</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Create project
          </h1>
          <p className="mt-2 max-w-xl font-semibold text-muted-foreground">
            Add a new project to organize your tasks. You can change status
            later.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/dashboard/projects"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex w-full justify-center sm:w-auto",
            )}
          >
            Back to projects
          </Link>
        </div>
      </header>

      <div className="w-full max-w-lg">
        <CreateProjectForm />
      </div>
    </div>
  );
}
