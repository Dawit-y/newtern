"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  LinkIcon,
  FileText,
  Video,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Trash2,
} from "lucide-react";

interface TaskCreationWizardProps {
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const taskSteps = [
  { id: 1, title: "Overview", description: "Task background and context" },
  { id: 2, title: "Instructions", description: "Detailed task description" },
  { id: 3, title: "Resources", description: "Helpful materials and links" },
  { id: 4, title: "Submission", description: "How interns should submit" },
];

type Task = {
  id: number;
  title: string;
  overview: string;
  description: string;
  resources: Resource[];
  submissionType: string[];
  submissionInstructions: string;
};

type Resource = {
  id: number;
  name: string;
  url: string;
  description: string;
  type: string;
  link: string;
};


export default function TaskCreationWizard({
  onClose,
  onTaskCreated,
}: TaskCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [taskData, setTaskData] = useState({
    id: Date.now(),
    title: "",
    overview: "",
    background: "",
    videoUrl: "",
    description: "",
    instructions: "",
    resources: [] as Resource[],
    submissionType: [] as string[],
    submissionInstructions: "",
  });

  const progress = (currentStep / taskSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < taskSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmissionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setTaskData({
        ...taskData,
        submissionType: [...taskData.submissionType, type],
      });
    } else {
      setTaskData({
        ...taskData,
        submissionType: taskData.submissionType.filter((t) => t !== type),
      });
    }
  };

  const addResource = (type: string) => {
    const newResource = {
      id: Date.now(),
      type,
      name: "",
      url: "",
      link: "",
      description: "",
    };
    setTaskData({
      ...taskData,
      resources: [...taskData.resources, newResource],
    });
  };

  const updateResource = (id: number, field: string, value: string) => {
    setTaskData({
      ...taskData,
      resources: taskData.resources.map((resource) =>
        resource.id === id ? { ...resource, [field]: value } : resource,
      ),
    });
  };

  const removeResource = (id: number) => {
    setTaskData({
      ...taskData,
      resources: taskData.resources.filter((resource) => resource.id !== id),
    });
  };

  const handleCreateTask = () => {
    onTaskCreated(taskData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Follow the steps to create a comprehensive task for your internship
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {currentStep} of {taskSteps.length}
            </span>
            <span className="text-muted-foreground text-sm">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between">
            {taskSteps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center space-y-2"
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    step.id <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Task Overview</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Provide context and background information for this task
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title *</Label>
                  <Input
                    id="task-title"
                    placeholder="e.g., Create a Landing Page Design"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({ ...taskData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-overview">Brief Overview *</Label>
                  <Textarea
                    id="task-overview"
                    placeholder="A short summary of what this task involves..."
                    className="min-h-[80px]"
                    value={taskData.overview}
                    onChange={(e) =>
                      setTaskData({ ...taskData, overview: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-background">Background & Context</Label>
                  <Textarea
                    id="task-background"
                    placeholder="Provide context about why this task is important, what problem it solves, or how it fits into the bigger picture..."
                    className="min-h-[120px]"
                    value={taskData.background}
                    onChange={(e) =>
                      setTaskData({ ...taskData, background: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-url">
                    Introduction Video (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="video-url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={taskData.videoUrl}
                      onChange={(e) =>
                        setTaskData({ ...taskData, videoUrl: e.target.value })
                      }
                    />
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Add a video to explain the task context and expectations
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Task Instructions
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Provide detailed instructions on what the intern needs to do
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-description">
                    Detailed Description *
                  </Label>
                  <Textarea
                    id="task-description"
                    placeholder="Explain what the intern needs to accomplish in this task..."
                    className="min-h-[120px]"
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({ ...taskData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-instructions">
                    Step-by-Step Instructions *
                  </Label>
                  <Textarea
                    id="task-instructions"
                    placeholder="1. First, do this...&#10;2. Then, do that...&#10;3. Finally, submit your work..."
                    className="min-h-[150px]"
                    value={taskData.instructions}
                    onChange={(e) =>
                      setTaskData({ ...taskData, instructions: e.target.value })
                    }
                  />
                  <p className="text-muted-foreground text-xs">
                    Break down the task into clear, actionable steps
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Resources & Materials
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Attach helpful resources, documents, or links for this task
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addResource("file")}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Add File
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addResource("link")}
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Add Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addResource("document")}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Add Document
                  </Button>
                </div>

                {taskData.resources.length === 0 ? (
                  <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed py-8 text-center">
                    <FileText className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
                      No resources added yet
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Add files, links, or documents to help interns complete
                      this task
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {taskData.resources.map((resource) => (
                      <Card key={resource.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded">
                              {resource.type === "file" && (
                                <Upload className="h-4 w-4" />
                              )}
                              {resource.type === "link" && (
                                <LinkIcon className="h-4 w-4" />
                              )}
                              {resource.type === "document" && (
                                <FileText className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <Input
                                placeholder="Resource name"
                                value={resource.name}
                                onChange={(e) =>
                                  updateResource(
                                    resource.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                              />
                              <Input
                                placeholder={
                                  resource.type === "link"
                                    ? "https://..."
                                    : "Upload file or enter URL"
                                }
                                value={resource.url}
                                onChange={(e) =>
                                  updateResource(
                                    resource.id,
                                    "url",
                                    e.target.value,
                                  )
                                }
                              />
                              <Input
                                placeholder="Brief description (optional)"
                                value={resource.description}
                                onChange={(e) =>
                                  updateResource(
                                    resource.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeResource(resource.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Submission Requirements
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Specify how interns should submit their completed work
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Submission Type(s) *</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="file-upload"
                        checked={taskData.submissionType.includes("file")}
                        onCheckedChange={(checked) =>
                          handleSubmissionTypeChange("file", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="file-upload"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        File Upload
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="url-submission"
                        checked={taskData.submissionType.includes("url")}
                        onCheckedChange={(checked) =>
                          handleSubmissionTypeChange("url", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="url-submission"
                        className="flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4" />
                        URL/Link Submission
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="text-submission"
                        checked={taskData.submissionType.includes("text")}
                        onCheckedChange={(checked) =>
                          handleSubmissionTypeChange("text", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="text-submission"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Text Response
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submission-instructions">
                    Submission Instructions
                  </Label>
                  <Textarea
                    id="submission-instructions"
                    placeholder="Provide specific instructions on what to include in the submission, file formats, naming conventions, etc..."
                    className="min-h-[100px]"
                    value={taskData.submissionInstructions}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        submissionInstructions: e.target.value,
                      })
                    }
                  />
                </div>

                {taskData.submissionType.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="mb-2 font-medium">
                      Selected submission types:
                    </h4>
                    <div className="flex gap-2">
                      {taskData.submissionType.map((type) => (
                        <Badge key={type} variant="secondary">
                          {type === "file" && "File Upload"}
                          {type === "url" && "URL/Link"}
                          {type === "text" && "Text Response"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < taskSteps.length ? (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateTask}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
