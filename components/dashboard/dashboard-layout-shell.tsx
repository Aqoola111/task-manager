"use client";

import { usePathname } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";

export function DashboardLayoutShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const tasksWide =
    pathname === "/dashboard/tasks" ||
    pathname?.startsWith("/dashboard/tasks/");

  return (
    <TooltipProvider delay={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex min-h-svh min-w-0 flex-col border-l border-border bg-background pt-[env(safe-area-inset-top)]">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b-2 border-border bg-background/90 px-3 backdrop-blur-md transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:px-4 md:px-6">
            <SidebarTrigger className="-ml-0.5 shrink-0 sm:-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-1 h-4 shrink-0 data-[orientation=vertical]:h-4 sm:mr-2"
            />
            <span className="min-w-0 truncate text-xs font-bold text-muted-foreground sm:text-sm">
              Workspace
            </span>
          </header>
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <div
              className={cn(
                "mx-auto w-full min-w-0 flex-1 px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pb-8 sm:pt-6 md:px-8 md:pb-10 md:pt-8 lg:px-10",
                tasksWide ? "max-w-none" : "max-w-5xl",
              )}
            >
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
