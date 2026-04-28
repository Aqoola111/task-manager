import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden border-b border-border bg-background px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] sm:p-6">
      <div className="mx-auto w-full max-w-xl px-1 text-center sm:px-0">
        <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl md:text-5xl">
          Task Management
        </h1>
        <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
          A focused Next.js workspace for projects and tasks, with Better Auth
          and tRPC.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mx-auto sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <Link
            href="/auth"
            className={cn(
              buttonVariants(),
              "min-h-11 w-full justify-center px-6 sm:w-auto sm:min-w-[140px]",
            )}
          >
            Get started
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-11 w-full justify-center px-6 sm:w-auto sm:min-w-[140px]",
            )}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
