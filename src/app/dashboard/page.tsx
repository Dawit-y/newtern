import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import InternDashboard from "@/components/dashboards/intern-dashboard";
import OrgDashboard from "@/components/dashboards/org-dashboard";
import AdminDashboard from "@/components/dashboards/admin-dashboard";
import SignOut from "@/components/auth/sign-out";

export default async function DashbaordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("Session data:", session);
  return (
    <div>
      {session?.user.role === "INTERN" && <InternDashboard />}
      {session?.user.role === "ORGANIZATION" && <OrgDashboard />}
      {session?.user.role === "ADMIN" && <AdminDashboard />}
      <div>
        <SignOut />
      </div>
      {!session?.user.role && <p>Please log in to access your dashboard.</p>}
    </div>
  );
}
