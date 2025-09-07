import React from "react";
import { auth } from "@/server/auth";
import InternDashboard from "@/components/dashboards/intern-dashboard";
import OrgDashboard from "@/components/dashboards/org-dashboard";
import AdminDashboard from "@/components/dashboards/admin-dashboard";

export default async function DashbaordPage() {
  const session = await auth();
  console.log("Session data:", session);
  return (
    <div>
      {session?.user.role === "INTERN" && <InternDashboard />}
      {session?.user.role === "ORGANIZATION" && <OrgDashboard />}
      {session?.user.role === "ADMIN" && <AdminDashboard />}
      {!session?.user.role && <p>Please log in to access your dashboard.</p>}
    </div>
  );
}
