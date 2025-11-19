"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { type TaskStatus } from "@/lib/validation/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  FileText,
  Play,
  ChevronRight,
  Download,
  ExternalLink,
  Upload,
  LinkIcon,
} from "lucide-react";
import TaskSubmissionForm from "@/components/intern/task-submission-form";

export default function InternshipPage() {
  const { slug } = useParams();
  const { data: internship } = api.internships.bySlug.useQuery(slug as string);

  // Memoize the tasks and determine which should be accessible
  const { accessibleTasks, defaultSelectedTask } = useMemo(() => {
    if (!internship?.tasks) {
      return { accessibleTasks: [], defaultSelectedTask: null };
    }

    const sortedTasks = [...internship.tasks].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const isApplicationAccepted =
      internship.userApplication?.status === "ACCEPTED";

    // Determine accessible tasks
    const accessibleTasks = sortedTasks.map((task, index) => {
      const isFirstTask = index === 0;
      const prevTask = index > 0 ? sortedTasks[index - 1] : null;
      const taskProgress = task.progress;

      const isAccessible =
        ((isFirstTask && isApplicationAccepted) ||
          (prevTask && prevTask.progress.status === "COMPLETED")) ??
        (taskProgress?.status === "IN_PROGRESS" ||
          taskProgress?.status === "COMPLETED");

      return {
        ...task,
        progress: taskProgress || { status: "NOT_STARTED" as TaskStatus },
        isAccessible,
      };
    });

    // Find the default task to select (first in-progress, or first accessible task)
    const firstInProgressTask = accessibleTasks.find(
      (t) => t.progress.status === "IN_PROGRESS",
    );
    const firstAccessibleTask = accessibleTasks.find((t) => t.isAccessible);
    const defaultSelectedTask = firstInProgressTask ?? firstAccessibleTask;

    return { accessibleTasks, defaultSelectedTask };
  }, [internship]);

  const [selectedTask, setSelectedTask] = useState(defaultSelectedTask);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const getTaskIcon = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Play className="h-5 w-5 text-blue-600" />;
      case "NOT_STARTED":
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "NOT_STARTED":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "URL":
        return <ExternalLink className="h-4 w-4" />;
      case "FILE":
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!internship) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Task List Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Complete tasks to finish your internship
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {accessibleTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => task.isAccessible && setSelectedTask(task)}
                  disabled={!task.isAccessible}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    selectedTask?.id === task.id
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "hover:bg-muted border-border"
                  } ${!task.isAccessible ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      {getTaskIcon(task.progress.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-medium">
                          {task.title}
                        </h4>
                        {selectedTask?.id === task.id && (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2 line-clamp-1 text-xs">
                        {task.overview}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={getTaskStatusColor(task.progress.status)}
                          className="text-xs"
                        >
                          {task.progress.status === "IN_PROGRESS"
                            ? "In Progress"
                            : task.progress.status === "COMPLETED"
                              ? "Completed"
                              : !task.isAccessible
                                ? "Locked"
                                : "Ready to Start"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Completion Rate
                </span>
                <span className="text-2xl font-bold">
                  {Math.round(
                    (accessibleTasks.filter(
                      (t) => t.progress.status === "COMPLETED",
                    ).length /
                      accessibleTasks.length) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Tasks Completed
                </span>
                <span className="text-2xl font-bold">
                  {
                    accessibleTasks.filter(
                      (t) => t.progress.status === "COMPLETED",
                    ).length
                  }
                  /{accessibleTasks.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Internship Status
                </span>
                <span className="text-2xl font-bold">
                  {internship.userApplication?.status ?? "PENDING"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Details */}
        <div className="lg:col-span-8">
          {selectedTask ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">
                        {selectedTask.title}
                      </h2>
                      <Badge
                        variant={getTaskStatusColor(
                          selectedTask.progress.status,
                        )}
                      >
                        {selectedTask.progress.status === "IN_PROGRESS"
                          ? "In Progress"
                          : selectedTask.progress.status === "COMPLETED"
                            ? "Completed"
                            : !selectedTask.isAccessible
                              ? "Locked"
                              : "Ready to Start"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {selectedTask.overview}
                    </p>
                  </div>
                </div>

                {selectedTask.progress.status === "IN_PROGRESS" && (
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span>No due date set</span>
                    </div>
                  </div>
                )}

                {selectedTask.progress.status === "COMPLETED" && (
                  <div className="text-muted-foreground flex items-center gap-2 pt-4 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      Completed on{" "}
                      {selectedTask.progress.completedAt?.toLocaleDateString() ??
                        "Unknown date"}
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {!selectedTask.isAccessible ? (
                  <div className="py-12 text-center">
                    <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">Task Locked</h3>
                    <p className="text-muted-foreground">
                      Complete the previous task to unlock this one
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="instructions">
                        Instructions
                      </TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="submission">Submission</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                      <div>
                        <h3 className="mb-3 font-semibold">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedTask.description}
                        </p>
                      </div>

                      {selectedTask.background && (
                        <div>
                          <h3 className="mb-3 font-semibold">
                            Background & Context
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {selectedTask.background}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="mb-3 font-semibold">Submission Types</h3>
                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {selectedTask.submitAsFile && (
                              <>
                                <Upload className="h-3 w-3" />
                                <span>File</span>
                              </>
                            )}

                            {selectedTask.submitAsUrl && (
                              <>
                                <LinkIcon className="h-3 w-3" />
                                <span>URL</span>
                              </>
                            )}

                            {selectedTask.submitAsText && (
                              <>
                                <FileText className="h-3 w-3" />
                                <span>Text</span>
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="instructions"
                      className="mt-6 space-y-4"
                    >
                      <div>
                        <h3 className="mb-4 font-semibold">
                          Step-by-Step Instructions
                        </h3>
                        <div className="space-y-3">
                          {selectedTask.instructions
                            ?.split("\n")
                            .map((instruction, index) => {
                              if (!instruction.trim()) return null;
                              return (
                                <div key={index} className="flex gap-3">
                                  <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <p className="text-muted-foreground pt-0.5">
                                    {instruction}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="resources" className="mt-6 space-y-4">
                      <div>
                        <h3 className="mb-4 font-semibold">
                          Helpful Resources
                        </h3>
                        {selectedTask.resources?.length > 0 ? (
                          <div className="space-y-3">
                            {selectedTask.resources.map((resource, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-4"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      {resource.name}
                                    </h4>
                                    <p className="text-muted-foreground text-sm">
                                      {resource.description ??
                                        resource.type.toLowerCase()}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={resource.url ?? resource.file ?? "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {resource.type === "URL"
                                      ? "Open"
                                      : "Download"}
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No resources available for this task.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="submission" className="mt-6 space-y-6">
                      {selectedTask.progress.status === "COMPLETED" ? (
                        <div className="space-y-6">
                          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
                            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
                            <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
                              Task Completed!
                            </h3>
                            <p className="mb-4 text-green-800 dark:text-green-200">
                              You submitted this task on{" "}
                              {selectedTask.progress.completedAt?.toLocaleDateString() ??
                                "unknown date"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="mb-3 font-semibold">
                              Submission Guidelines
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {selectedTask.submissionInstructions}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <Button
                              onClick={() => setShowSubmissionForm(true)}
                              className="w-full"
                              size="lg"
                            >
                              Submit Your Work
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">No Task Selected</h3>
                <p className="text-muted-foreground">
                  Select a task from the left sidebar to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submission Form Dialog */}
      {showSubmissionForm && selectedTask && (
        <TaskSubmissionForm
          task={selectedTask}
          onClose={() => setShowSubmissionForm(false)}
          onSubmit={(data) => {
            console.log("Submission data:", data);
            setShowSubmissionForm(false);
          }}
        />
      )}
    </>
  );
}
