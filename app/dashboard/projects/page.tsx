"use client";

import Link from "next/link";
import { LayoutGroup } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { DataTableSkeleton } from "@/components/dashboard/data-table-skeleton";
import { MotionTableRow } from "@/components/motion/motion-table-row";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.project.all.queryOptions(undefined, { retry: false }),
  );

  const rows = data ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted-foreground">Workspace</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Projects
          </h1>
          <p className="mt-2 font-semibold text-muted-foreground">
            All projects you have access to.
          </p>
        </div>
        <Link
          href="/dashboard/projects/create"
          className={cn(
            buttonVariants(),
            "w-full shrink-0 justify-center sm:w-fit sm:justify-start",
          )}
        >
          Add project
        </Link>
      </header>

      <Card className="min-w-0 overflow-hidden bg-card">
        <CardContent className="min-w-0 pt-4 sm:pt-6">
          {isLoading ? (
            <DataTableSkeleton rows={8} columns={3} />
          ) : error ? (
            <p className="py-12 text-center text-sm font-bold text-destructive">
              {error.message || "Could not load projects."}
            </p>
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm font-semibold text-muted-foreground">
              No projects yet.
            </p>
          ) : (
            <LayoutGroup id="projects-table">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-4 text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <MotionTableRow
                    key={String(row._id)}
                    layout
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 38,
                    }}
                  >
                    <TableCell className="pl-4 font-bold">{row.name}</TableCell>
                    <TableCell>
                      <StatusBadge variant="project" status={row.status} />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
