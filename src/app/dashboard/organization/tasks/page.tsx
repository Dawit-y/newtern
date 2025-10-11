"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { api, type RouterOutputs } from "@/trpc/react";
import { useOrganizationProfile } from "@/hooks/use-profile";
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
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Search,
  Upload,
  LinkIcon,
  CheckCircle,
  Clock,
} from "lucide-react";

type Task = RouterOutputs["tasks"]["listByOrganizationId"][number];

export default function TasksPage() {
  const { organizationId, isLoading: isProfileLoading } =
    useOrganizationProfile();

  const { data: tasks, isLoading } = api.tasks.listByOrganizationId.useQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getSubmissionTypes = (task: Task): string[] => {
    const types: string[] = [];
    if (task.submitAsFile) types.push("file");
    if (task.submitAsText) types.push("text");
    if (task.submitAsUrl) types.push("url");
    return types;
  };

  const getStatus = (task: Task) => {
    if (!task.internship.published) return "draft";
    if (new Date(task.createdAt) < new Date()) return "active";
    return "completed";
  };

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

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      const status = getStatus(task);
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.internship.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    if (!tasks) return { total: 0, active: 0, completed: 0, draft: 0 };
    const all = tasks.map(getStatus);
    return {
      total: tasks.length,
      active: all.filter((s) => s === "active").length,
      completed: all.filter((s) => s === "completed").length,
      draft: all.filter((s) => s === "draft").length,
    };
  }, [tasks]);

  if (isProfileLoading || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Tasks", icon: FileText, count: stats.total },
          { title: "Active Tasks", icon: Clock, count: stats.active },
          { title: "Completed", icon: CheckCircle, count: stats.completed },
          { title: "Draft", icon: Edit, count: stats.draft },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-muted-foreground text-xs">
                Across all internships
              </p>
            </CardContent>
          </Card>
        ))}
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            Manage tasks across all your internship programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              No tasks found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Internship</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Type</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const status = getStatus(task);
                  const submissionTypes = getSubmissionTypes(task);
                  return (
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
                        <div className="font-medium">
                          {task.internship.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(status)}>{status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {submissionTypes.map((type) => (
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
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{task.resources.length}</TableCell>
                      <TableCell>
                        {format(task.createdAt, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedTask(task)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      {selectedTask && (
        <Dialog
          open={!!selectedTask}
          onOpenChange={() => setSelectedTask(null)}
        >
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>
                Task under {selectedTask.internship.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {selectedTask.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {getSubmissionTypes(selectedTask).map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
              <div className="text-sm">
                <strong>Resources:</strong> {selectedTask.resources.length}
              </div>
              <div className="text-sm">
                <strong>Created at:</strong>{" "}
                {format(selectedTask.createdAt, "MMM dd, yyyy")}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
