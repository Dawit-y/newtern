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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Edit,
  Trash2,
  Calendar,
  FileText,
  Search,
  Plus,
  Upload,
  LinkIcon,
  CheckCircle,
  Clock,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  internship: string;
  internshipId: number;
  description: string;
  submissionType: string[];
  status: string;
  assignedInterns: number;
  completedSubmissions: number;
  resources: number;
  createdDate: string;
  dueDate: string;
};

// Mock data
const tasks = [
  {
    id: 1,
    title: "Create Landing Page Design",
    internship: "Frontend Developer Intern",
    internshipId: 1,
    description: "Design a modern landing page for our new product launch",
    submissionType: ["file", "url"],
    status: "active",
    assignedInterns: 2,
    completedSubmissions: 1,
    resources: 3,
    createdDate: "Nov 1, 2024",
    dueDate: "Nov 20, 2024",
  },
  {
    id: 2,
    title: "Data Analysis Report",
    internship: "Data Analyst Intern",
    internshipId: 2,
    description: "Analyze customer behavior data and create insights report",
    submissionType: ["file", "text"],
    status: "active",
    assignedInterns: 1,
    completedSubmissions: 0,
    resources: 5,
    createdDate: "Nov 5, 2024",
    dueDate: "Nov 25, 2024",
  },
  {
    id: 3,
    title: "Social Media Campaign",
    internship: "Marketing Intern",
    internshipId: 3,
    description:
      "Create and execute a social media campaign for brand awareness",
    submissionType: ["url", "text"],
    status: "completed",
    assignedInterns: 1,
    completedSubmissions: 1,
    resources: 2,
    createdDate: "Oct 15, 2024",
    dueDate: "Nov 1, 2024",
  },
  {
    id: 4,
    title: "API Documentation",
    internship: "Frontend Developer Intern",
    internshipId: 1,
    description: "Document the REST API endpoints for the mobile app",
    submissionType: ["file"],
    status: "draft",
    assignedInterns: 0,
    completedSubmissions: 0,
    resources: 1,
    createdDate: "Nov 10, 2024",
    dueDate: "Dec 1, 2024",
  },
  {
    id: 5,
    title: "User Research Study",
    internship: "UI/UX Design Intern",
    internshipId: 4,
    description: "Conduct user interviews and create research findings report",
    submissionType: ["file", "text"],
    status: "active",
    assignedInterns: 1,
    completedSubmissions: 0,
    resources: 4,
    createdDate: "Nov 8, 2024",
    dueDate: "Nov 30, 2024",
  },
];

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "outline";
      case "draft":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case "file":
        return <Upload className="h-3 w-3" />;
      case "url":
        return <LinkIcon className="h-3 w-3" />;
      case "text":
        return <FileText className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.internship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((task) => task.status === "active").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    draft: tasks.filter((task) => task.status === "draft").length,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage tasks across all your internships
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">
              Across all internships
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-muted-foreground text-xs">Currently assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-muted-foreground text-xs">Finished tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-muted-foreground text-xs">Not yet published</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            Manage tasks across all your internship programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Internship</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submission Type</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-muted-foreground line-clamp-1 text-sm">
                        {task.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{task.internship}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {task.submissionType.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          <span className="flex items-center gap-1">
                            {getSubmissionTypeIcon(type)}
                            {type}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {task.completedSubmissions}/{task.assignedInterns}{" "}
                      completed
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      {task.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Task Details</DialogTitle>
                            <DialogDescription>
                              View and manage task information
                            </DialogDescription>
                          </DialogHeader>

                          {selectedTask && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Task Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {selectedTask.title}
                                      </h3>
                                      <p className="text-muted-foreground">
                                        {selectedTask.internship}
                                      </p>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">
                                        Description
                                      </label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedTask.description}
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">
                                          Status
                                        </label>
                                        <div className="mt-1">
                                          <Badge
                                            variant={getStatusColor(
                                              selectedTask.status,
                                            )}
                                          >
                                            {selectedTask.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">
                                          Due Date
                                        </label>
                                        <p className="text-muted-foreground text-sm">
                                          {selectedTask.dueDate}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Progress & Submissions
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        Assigned Interns
                                      </label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedTask.assignedInterns}
                                      </p>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">
                                        Completed Submissions
                                      </label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedTask.completedSubmissions}
                                      </p>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">
                                        Submission Types
                                      </label>
                                      <div className="mt-1 flex gap-1">
                                        {selectedTask.submissionType.map(
                                          (type: string) => (
                                            <Badge
                                              key={type}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              <span className="flex items-center gap-1">
                                                {getSubmissionTypeIcon(type)}
                                                {type}
                                              </span>
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">
                                        Resources
                                      </label>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedTask.resources} attached
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <div className="flex items-center justify-end gap-3 border-t pt-4">
                                <Button variant="outline">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Submissions
                                </Button>
                                <Button>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Task
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
