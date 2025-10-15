import InternshipHeader from "@/components/intern/internship-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InternshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const internship = {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Afroel Tech",
    companyLogo: "/company-logo.png",
    type: "Remote",
    location: "Addis Ababa",
    duration: "3 months",
    deadline: "Nov 30, 2025",
    salary: "$300/month",
    applicants: 42,
    skills: ["React", "Next.js", "TypeScript"],
    status: "accepted" as "accepted" | "pending" | "rejected" | "not_applied", // or pending, rejected, not_applied
    workspaceData: {
      startDate: "Oct 1, 2025",
      endDate: "Dec 31, 2025",
      tasksCompleted: 7,
      totalTasks: 10,
      progress: 70,
      mentor: { name: "John Doe", role: "Tech Lead", avatar: "" },
    },
  };

  return (
    <main className="from-background to-muted/20 flex-1 bg-gradient-to-b">
      <div className="container px-4 py-8 md:px-6">
        <Link href="/dashboard/intern">
          <Button variant="ghost" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <InternshipHeader internship={internship} canApply />
        <div className="container">{children}</div>
      </div>
    </main>
  );
}
