import "@/styles/globals.css";

import { type Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Newtern | Intern",
  description: "Virtual Internships Platform - Intern",
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
  if (session.user.role !== "INTERN") {
    redirect("/");
  }

  return <>{children}</>;
}
