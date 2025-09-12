"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Briefcase,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  UserCheck,
} from "lucide-react";

const internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    status: "active",
    applicants: 23,
    selected: 2,
    tasks: 5,
    deadline: "Dec 15, 2024",
    created: "Nov 1, 2024",
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    status: "draft",
    applicants: 0,
    selected: 0,
    tasks: 8,
    deadline: "Dec 20, 2024",
    created: "Nov 10, 2024",
  },
  {
    id: 3,
    title: "Marketing Intern",
    status: "completed",
    applicants: 12,
    selected: 1,
    tasks: 4,
    deadline: "Nov 30, 2024",
    created: "Oct 15, 2024",
  },
];

const applications = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@email.com",
    internship: "Frontend Developer Intern",
    status: "pending",
    appliedDate: "Nov 15, 2024",
    score: 85,
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike@email.com",
    internship: "Frontend Developer Intern",
    status: "accepted",
    appliedDate: "Nov 12, 2024",
    score: 92,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@email.com",
    internship: "Marketing Intern",
    status: "rejected",
    appliedDate: "Nov 8, 2024",
    score: 67,
  },
];

export default function OrganizationDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Internships
            </CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-muted-foreground text-xs">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Selected Interns
            </CardTitle>
            <UserCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-muted-foreground text-xs">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Internships */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Internships</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{internship.title}</h4>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {internship.applicants} applicants
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {internship.deadline}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      internship.status === "active"
                        ? "default"
                        : internship.status === "draft"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {internship.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {application.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{application.name}</h4>
                    <p className="text-muted-foreground text-xs">
                      {application.internship}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {application.score}%
                  </span>
                  <Badge
                    variant={
                      application.status === "accepted"
                        ? "default"
                        : application.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {application.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
