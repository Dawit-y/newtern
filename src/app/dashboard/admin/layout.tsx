import "@/styles/globals.css";

import { type Metadata } from "next";
import { AppSidebar, type IconName } from "@/components/dashboards/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Newtern | Admin",
  description: "Virtual Internships Platform - Admin",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const adminSidebarData = {
    header: {
      title: "Admin Panel",
      subtitle: "Newtern Platform",
      icon: "Shield" as IconName,
    },
    groups: [
      {
        label: "Dashboard",
        items: [
          {
            label: "Overview",
            icon: "BarChart3" as IconName,
            href: "/dashboard/admin",
            isActive: true,
          },
          {
            label: "Analytics",
            icon: "TrendingUp" as IconName,
            href: "/dashboard/admin/analytics",
          },
        ],
      },
      {
        label: "Management",
        items: [
          {
            label: "Users",
            icon: "Users" as IconName,
            href: "/dashboard/admin/users",
          },
          {
            label: "Organizations",
            icon: "Building2" as IconName,
            href: "/dashboard/admin/organizations",
          },
          {
            label: "Internships",
            icon: "Briefcase" as IconName,
            href: "/dashboard/admin/internships",
          },
          {
            label: "Reports",
            icon: "Flag" as IconName,
            href: "/dashboard/admin/reports",
          },
        ],
      },
      {
        label: "System",
        items: [
          {
            label: "Settings",
            icon: "Settings" as IconName,
            href: "/dashboard/admin/settings",
          },
          {
            label: "Database",
            icon: "Database" as IconName,
            href: "/dashboard/admin/database",
          },
          {
            label: "Communications",
            icon: "Mail" as IconName,
            href: "/dashboard/admin/communications",
          },
        ],
      },
    ],
    footer: {
      name: session.user.name || "John Doe",
      avatarFallback: session.user.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "JD",
      avatarSrc: "/placeholder.svg?height=24&width=24",
    },
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar data={adminSidebarData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
