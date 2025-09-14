"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  UserCheck,
  FileText,
  Search,
  Star,
  Award,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";

type Intern = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  internship: string;
  internshipId: number;
  university: string;
  major: string;
  startDate: string;
  endDate: string;
  status: string;
  overallProgress: number;
  tasksCompleted: number;
  totalTasks: number;
  currentTask: string;
  rating: number;
  skills: string[];
  recentActivity: string;
  tasks: {
    id: number;
    title: string;
    status: string;
    completedDate?: string;
    dueDate?: string;
    score?: number;
  }[];
};

// Mock data
const interns = [
  {
    id: 1,
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 987-6543",
    avatar: "/placeholder.svg?height=40&width=40",
    internship: "Frontend Developer Intern",
    internshipId: 1,
    university: "NYU",
    major: "Computer Science",
    startDate: "Nov 1, 2024",
    endDate: "Feb 1, 2025",
    status: "active",
    overallProgress: 65,
    tasksCompleted: 3,
    totalTasks: 5,
    currentTask: "Create Landing Page Design",
    rating: 4.8,
    skills: ["React", "TypeScript", "CSS", "JavaScript"],
    recentActivity: "Submitted task 2 hours ago",
    tasks: [
      {
        id: 1,
        title: "Setup Development Environment",
        status: "completed",
        completedDate: "Nov 2, 2024",
        score: 95,
      },
      {
        id: 2,
        title: "Create Component Library",
        status: "completed",
        completedDate: "Nov 8, 2024",
        score: 88,
      },
      {
        id: 3,
        title: "Build User Dashboard",
        status: "completed",
        completedDate: "Nov 15, 2024",
        score: 92,
      },
      {
        id: 4,
        title: "Create Landing Page Design",
        status: "in-progress",
        dueDate: "Nov 25, 2024",
      },
      {
        id: 5,
        title: "API Integration",
        status: "pending",
        dueDate: "Dec 5, 2024",
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    internship: "UI/UX Design Intern",
    internshipId: 4,
    university: "Stanford University",
    major: "Design",
    startDate: "Oct 15, 2024",
    endDate: "Jan 15, 2025",
    status: "active",
    overallProgress: 80,
    tasksCompleted: 4,
    totalTasks: 5,
    currentTask: "User Research Study",
    rating: 4.9,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    recentActivity: "Completed task yesterday",
    tasks: [
      {
        id: 1,
        title: "Design System Audit",
        status: "completed",
        completedDate: "Oct 20, 2024",
        score: 96,
      },
      {
        id: 2,
        title: "User Persona Creation",
        status: "completed",
        completedDate: "Oct 28, 2024",
        score: 94,
      },
      {
        id: 3,
        title: "Wireframe Development",
        status: "completed",
        completedDate: "Nov 5, 2024",
        score: 91,
      },
      {
        id: 4,
        title: "Prototype Testing",
        status: "completed",
        completedDate: "Nov 12, 2024",
        score: 93,
      },
      {
        id: 5,
        title: "User Research Study",
        status: "in-progress",
        dueDate: "Nov 30, 2024",
      },
    ],
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@email.com",
    phone: "+1 (555) 321-0987",
    avatar: "/placeholder.svg?height=40&width=40",
    internship: "Data Analyst Intern",
    internshipId: 2,
    university: "UCLA",
    major: "Data Science",
    startDate: "Nov 20, 2024",
    endDate: "Mar 20, 2025",
    status: "active",
    overallProgress: 25,
    tasksCompleted: 1,
    totalTasks: 4,
    currentTask: "Data Cleaning Pipeline",
    rating: 4.5,
    skills: ["Python", "SQL", "Machine Learning", "Tableau"],
    recentActivity: "Started 3 days ago",
    tasks: [
      {
        id: 1,
        title: "Environment Setup",
        status: "completed",
        completedDate: "Nov 21, 2024",
        score: 89,
      },
      {
        id: 2,
        title: "Data Cleaning Pipeline",
        status: "in-progress",
        dueDate: "Dec 1, 2024",
      },
      {
        id: 3,
        title: "Analysis Report",
        status: "pending",
        dueDate: "Dec 15, 2024",
      },
      {
        id: 4,
        title: "Dashboard Creation",
        status: "pending",
        dueDate: "Jan 5, 2025",
      },
    ],
  },
];

export default function InternsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredInterns = interns.filter((intern) => {
    return (
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.internship.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    total: interns.length,
    active: interns.filter((intern) => intern.status === "active").length,
    avgProgress: Math.round(
      interns.reduce((sum, intern) => sum + intern.overallProgress, 0) /
        interns.length,
    ),
    avgRating: (
      interns.reduce((sum, intern) => sum + intern.rating, 0) / interns.length
    ).toFixed(1),
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interns</h1>
          <p className="text-muted-foreground">
            Monitor progress and manage your active interns
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Interns
            </CardTitle>
            <UserCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-muted-foreground text-xs">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-muted-foreground text-xs">Across all interns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <p className="text-muted-foreground text-xs">Performance rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search interns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Interns Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInterns.map((intern) => (
          <Card key={intern.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={intern.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedIntern && (
                        <AvatarFallback className="text-lg">
                          {selectedIntern.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{intern.name}</CardTitle>
                    <CardDescription>{intern.internship}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="text-sm font-medium">{intern.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{intern.overallProgress}%</span>
                </div>
                <Progress value={intern.overallProgress} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <p className="font-medium">
                    {intern.tasksCompleted}/{intern.totalTasks}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Task</span>
                  <p className="line-clamp-1 font-medium">
                    {intern.currentTask}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">Recent Activity</span>
                <p className="font-medium">{intern.recentActivity}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline">{intern.status}</Badge>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntern(intern)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Intern Progress Details</DialogTitle>
                        <DialogDescription>
                          Detailed view of {intern.name}&apos;s internship
                          progress
                        </DialogDescription>
                      </DialogHeader>

                      {selectedIntern && (
                        <div className="space-y-6">
                          {/* Intern Info */}
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  Intern Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={
                                        selectedIntern.avatar ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback className="text-lg">
                                      {selectedIntern?.name
                                        ? selectedIntern.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                        : "SI"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">
                                      {selectedIntern.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {selectedIntern.internship}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">
                                      {selectedIntern.email}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">
                                      {selectedIntern.phone}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">
                                      {selectedIntern.university} •{" "}
                                      {selectedIntern.major}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="text-muted-foreground h-4 w-4" />
                                    <span className="text-sm">
                                      {selectedIntern.startDate} -{" "}
                                      {selectedIntern.endDate}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  Performance Overview
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Overall Progress</span>
                                    <span>
                                      {selectedIntern.overallProgress}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={selectedIntern.overallProgress}
                                    className="w-full"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-muted-foreground text-sm">
                                      Tasks Completed
                                    </span>
                                    <p className="text-2xl font-bold">
                                      {selectedIntern.tasksCompleted}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground text-sm">
                                      Total Tasks
                                    </span>
                                    <p className="text-2xl font-bold">
                                      {selectedIntern.totalTasks}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <span className="text-muted-foreground text-sm">
                                    Performance Rating
                                  </span>
                                  <div className="mt-1 flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-current text-yellow-400" />
                                    <span className="text-xl font-bold">
                                      {selectedIntern.rating}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <span className="text-muted-foreground text-sm">
                                    Skills
                                  </span>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {selectedIntern.skills.map(
                                      (skill: string) => (
                                        <Badge
                                          key={skill}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {skill}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Task Progress */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Task Progress
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {selectedIntern.tasks.map(
                                  (task, index: number) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                          {index + 1}
                                        </div>
                                        <div>
                                          <h4 className="font-medium">
                                            {task.title}
                                          </h4>
                                          {task.status === "completed" && (
                                            <p className="text-muted-foreground text-xs">
                                              Completed {task.completedDate} •
                                              Score: {task.score}%
                                            </p>
                                          )}
                                          {task.status === "in-progress" && (
                                            <p className="text-muted-foreground text-xs">
                                              Due: {task.dueDate}
                                            </p>
                                          )}
                                          {task.status === "pending" && (
                                            <p className="text-muted-foreground text-xs">
                                              Due: {task.dueDate}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {task.status === "completed" &&
                                          task.score && (
                                            <div className="flex items-center gap-1">
                                              <Award className="h-4 w-4 text-yellow-500" />
                                              <span className="text-sm font-medium">
                                                {task.score}%
                                              </span>
                                            </div>
                                          )}
                                        <Badge
                                          variant={getTaskStatusColor(
                                            task.status,
                                          )}
                                        >
                                          {task.status === "in-progress"
                                            ? "In Progress"
                                            : task.status === "completed"
                                              ? "Completed"
                                              : "Pending"}
                                        </Badge>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Button variant="outline">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </Button>
                            <Button>
                              <Eye className="mr-2 h-4 w-4" />
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        View Submissions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
