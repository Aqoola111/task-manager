import type { Metadata } from "next";

import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";

export const metadata: Metadata = {
  title: "Dashboard — Task Manager",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
