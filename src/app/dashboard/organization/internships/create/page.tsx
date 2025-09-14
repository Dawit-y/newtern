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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  FileText,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import TaskCreationWizard from "@/components/organization/task-creation-wizard";

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Internship details and requirements",
  },
  { id: 2, title: "Tasks", description: "Create tasks for this internship" },
  {
    id: 3,
    title: "Review & Publish",
    description: "Review and publish your internship",
  },
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
  type: string;
  link: string;
};

export default function CreateInternshipPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskWizard, setShowTaskWizard] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    type: "",
    location: "",
    requirements: "",
    skills: [] as string[],
    deadline: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTaskCreated = (task: Task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
    setShowTaskWizard(false);
  };

  const removeTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Internship
            </h1>
            <p className="text-muted-foreground">
              Set up a new internship program with tasks and requirements
            </p>
          </div>
          <Link href="/dashboard/organization/internships">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Internships
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-muted-foreground text-sm">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center space-y-2"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step.id <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Internship Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Frontend Developer Intern"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) =>
                          setFormData({ ...formData, duration: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-month">1 Month</SelectItem>
                          <SelectItem value="2-months">2 Months</SelectItem>
                          <SelectItem value="3-months">3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="12-months">12 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="stipend">Stipend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Remote, New York, NY"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the internship, what the intern will learn and accomplish..."
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="List the requirements, qualifications, and skills needed..."
                      className="min-h-[100px]"
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <p className="text-muted-foreground">
                      Create tasks that interns will complete during this
                      internship
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowTaskWizard(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>

                {tasks.length === 0 ? (
                  <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed py-12 text-center">
                    <FileText className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                    <h4 className="mb-2 text-lg font-medium">
                      No tasks created yet
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Start by creating your first task for this internship
                    </p>
                    <Button onClick={() => setShowTaskWizard(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <Card key={task.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle className="text-base">
                                  {task.title}
                                </CardTitle>
                                <CardDescription>
                                  {task.overview}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {task.submissionType}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTask(task.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-muted-foreground text-sm">
                            {task.description.substring(0, 150)}...
                          </div>
                          {task.resources && task.resources.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                Resources:
                              </span>
                              {task.resources.map(
                                (resource: Resource, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {resource.type}
                                  </Badge>
                                ),
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review & Publish</h3>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Internship Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Title</Label>
                          <p className="text-muted-foreground text-sm">
                            {formData.title || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Duration
                          </Label>
                          <p className="text-muted-foreground text-sm">
                            {formData.duration || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Type</Label>
                          <p className="text-muted-foreground text-sm">
                            {formData.type || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Location
                          </Label>
                          <p className="text-muted-foreground text-sm">
                            {formData.location || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Description
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {formData.description || "Not specified"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks ({tasks.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tasks.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No tasks created
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {tasks.map((task, index) => (
                            <div
                              key={task.id}
                              className="flex items-center gap-3 rounded border p-2"
                            >
                              <span className="text-sm font-medium">
                                {index + 1}.
                              </span>
                              <span className="text-sm">{task.title}</span>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                {task.submissionType}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Publish Internship
            </Button>
          )}
        </div>
      </div>

      {/* Task Creation Wizard Modal */}
      {showTaskWizard && (
        <TaskCreationWizard
          onClose={() => setShowTaskWizard(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </>
  );
}
