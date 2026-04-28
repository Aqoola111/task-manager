import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getQueryClient, trpc } from "@/lib/trpc/server";

const overviewQueryOpts = { retry: false as const };
const RECENT_TASKS_LIMIT = 10;

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      trpc.project.all.queryOptions(undefined, overviewQueryOpts),
    ),
    queryClient.prefetchQuery(trpc.task.all.queryOptions(undefined, overviewQueryOpts)),
    queryClient.prefetchQuery(
      trpc.project.recent.queryOptions({ limit: 5 }, overviewQueryOpts),
    ),
    queryClient.prefetchQuery(
      trpc.task.recent.queryOptions(
        { limit: RECENT_TASKS_LIMIT },
        overviewQueryOpts,
      ),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardOverview />
    </HydrationBoundary>
  );
}
