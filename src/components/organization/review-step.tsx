"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  FileText,
  Upload,
  LinkIcon,
  ExternalLink,
  Download,
  Calendar,
  Target,
  MapPin,
  Layers,
  ListChecks,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ResourceType } from "@/lib/validation/resources";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  internshipId: string | null;
}

export default function ReviewStep({ internshipId }: ReviewStepProps) {
  const { data: internshipData, isLoading } = api.internships.byId.useQuery(
    internshipId ?? "",
    { enabled: !!internshipId },
  );

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-12">
        Loading internship details...
      </div>
    );
  }

  if (!internshipData) {
    return (
      <div className="text-muted-foreground flex justify-center py-12">
        No internship data found.
      </div>
    );
  }

  const selectedTask = internshipData.tasks[selectedTaskIndex];

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "URL":
        return <ExternalLink className="h-4 w-4" />;
      case "FILE":
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getInstructionNumber = (instruction: string, index: number) => {
    const match = /^\d+/.exec(instruction);
    return match ? match[0] : index + 1;
  };

  return (
    <div className="space-y-10">
      {/* Internship Overview */}
      <Card className="bg-muted/20 border-none shadow-none">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{internshipData.title}</h1>
              <p className="text-muted-foreground mt-2">
                {internshipData.description}
              </p>
            </div>
            <Badge
              variant={internshipData.published ? "default" : "secondary"}
              className="text-sm"
            >
              {internshipData.published ? "Published" : "Draft"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>
                <strong>Deadline:</strong>{" "}
                {new Date(internshipData.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span>
                <strong>Location:</strong> {internshipData.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="text-muted-foreground h-4 w-4" />
              <span>
                <strong>Type:</strong> {internshipData.type}
              </span>
            </div>
          </div>

          {internshipData.skills.length > 0 && (
            <div>
              <h3 className="mb-2 text-base font-semibold">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {internshipData.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Layout */}
      {internshipData.tasks.length > 0 ? (
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <Card className="bg-muted/30 border-none p-2 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <ListChecks className="text-primary h-5 w-5" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {internshipData.tasks.map((task, i) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskIndex(i)}
                    className={cn(
                      "w-full rounded-lg px-4 py-3 text-left text-sm transition-all",
                      selectedTaskIndex === i
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.title}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          selectedTaskIndex === i &&
                            "bg-primary-foreground text-primary",
                        )}
                      >
                        #{i + 1}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                      {task.overview || "No overview provided"}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Task Details */}
          <div className="md:w-3/4">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold">
                      {selectedTask?.title}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Target className="h-3 w-3" />
                      Task {selectedTaskIndex + 1}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-base">
                    {selectedTask?.overview}
                  </p>
                </div>

                <Separator className="my-6" />

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="mb-6 grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="submission">Submission</TabsTrigger>
                  </TabsList>

                  {/* Overview */}
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <div>
                      <h3 className="mb-2 font-semibold">Task Description</h3>
                      <p className="text-muted-foreground">
                        {selectedTask?.description}
                      </p>
                    </div>

                    {selectedTask?.background && (
                      <div>
                        <h3 className="mb-2 font-semibold">
                          Background & Context
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedTask?.background}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Instructions */}
                  <TabsContent value="instructions" className="mt-6 space-y-4">
                    {selectedTask?.instructions ? (
                      selectedTask?.instructions
                        .split("\n")
                        .filter((i) => i.trim())
                        .map((instruction, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                              {getInstructionNumber(instruction, i)}
                            </div>
                            <p className="text-muted-foreground">
                              {instruction.replace(/^\d+\.\s*/, "")}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground">
                        No instructions provided.
                      </p>
                    )}
                  </TabsContent>

                  {/* Resources */}
                  <TabsContent value="resources" className="mt-6 space-y-4">
                    {selectedTask?.resources?.length ? (
                      <div className="space-y-3">
                        {selectedTask.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div>
                                <h4 className="font-medium">{resource.name}</h4>
                                <p className="text-muted-foreground text-sm">
                                  {resource.type.toLowerCase()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {resource.type === "URL"
                                ? "External Link"
                                : "Download"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">
                        <FileText className="mx-auto mb-2 h-8 w-8" />
                        No resources added yet.
                      </div>
                    )}
                  </TabsContent>

                  {/* Submission */}
                  <TabsContent value="submission" className="mt-6 space-y-4">
                    <h3 className="mb-2 font-semibold">
                      Submission Guidelines
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedTask?.submissionInstructions}
                    </p>

                    <Separator />

                    <h3 className="mb-2 font-semibold">
                      Accepted Submission Formats
                    </h3>
                    <div className="space-y-3">
                      {selectedTask?.submitAsFile && (
                        <div className="flex gap-3 rounded-lg border p-3">
                          <Upload className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                          <p className="text-muted-foreground text-sm">
                            File uploads allowed (PDF, DOC, PNG, ZIP)
                          </p>
                        </div>
                      )}
                      {selectedTask?.submitAsUrl && (
                        <div className="flex gap-3 rounded-lg border p-3">
                          <LinkIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                          <p className="text-muted-foreground text-sm">
                            URL links (GitHub, Drive, etc.)
                          </p>
                        </div>
                      )}
                      {selectedTask?.submitAsText && (
                        <div className="flex gap-3 rounded-lg border p-3">
                          <FileText className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                          <p className="text-muted-foreground text-sm">
                            Written responses accepted.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground py-12 text-center">
          <FileText className="mx-auto mb-2 h-8 w-8" />
          No tasks found for this internship.
        </div>
      )}
    </div>
  );
}
