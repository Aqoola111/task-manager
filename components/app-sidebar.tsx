"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowLeft,
  FolderKanban,
  FolderPlus,
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Settings,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const nav = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: FolderKanban,
    exact: false,
  },
  {
    href: "/dashboard/projects/create",
    label: "New project",
    icon: FolderPlus,
    exact: true,
  },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: ListTodo,
    exact: false,
  },
  {
    href: "/dashboard/tasks/create",
    label: "New task",
    icon: PlusCircle,
    exact: true,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    exact: true,
  },
] as const;

type NavItem = (typeof nav)[number];

function resolveActiveHref(pathname: string): string | null {
  const matches = nav.filter((item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
  if (matches.length === 0) return null;
  return matches.reduce((best, item) =>
    item.href.length > best.href.length ? item : best,
  ).href;
}

export function AppSidebar() {
  const pathname = usePathname();
  const activeHref = useMemo(() => resolveActiveHref(pathname), [pathname]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ListTodo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Task Manager</span>
                <span className="truncate text-xs text-muted-foreground">
                  Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {nav.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} prefetch />}
                  tooltip={label}
                  isActive={activeHref === href}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to home"
              className="text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              <span>Back to home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
