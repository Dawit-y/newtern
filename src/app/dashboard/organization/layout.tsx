import { type Metadata } from "next";
import { AppSidebar, type IconName } from "@/components/dashboards/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Header from "@/components/dashboards/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Newtern | Organization",
  description: "Virtual Internships Platform - Organization",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function OrganizationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.role !== "ORGANIZATION") {
    redirect("/");
  }

  const organizationSidebarData = {
    header: {
      title: "TechStart Inc.",
      subtitle: "Organization",
      icon: "Building2" as IconName,
    },
    groups: [
      {
        label: "Main",
        items: [
          {
            label: "Overview",
            icon: "TrendingUp" as IconName,
            href: "/dashboard/organization",
          },
          {
            label: "Internships",
            icon: "Briefcase" as IconName,
            href: "/dashboard/organization/internships",
          },
          {
            label: "Applications",
            icon: "Users" as IconName,
            href: "/dashboard/organization/applications",
          },
          {
            label: "Tasks",
            icon: "FileText" as IconName,
            href: "/dashboard/organization/tasks",
          },
          {
            label: "Interns",
            icon: "UserCheck" as IconName,
            href: "/dashboard/organization/interns",
          },
          {
            label: "Evaluations",
            icon: "Star" as IconName,
            href: "/dashboard/organization/evaluations",
          },
        ],
      },
      {
        label: "Management",
        items: [
          {
            label: "Settings",
            icon: "Settings" as IconName,
            href: "/dashboard/organization/settings",
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
        <AppSidebar data={organizationSidebarData} />
        <SidebarInset className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
