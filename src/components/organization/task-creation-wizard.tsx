"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/trpc/react";
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
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { type ResourceType, taskSchema } from "@/lib/validation/internships";

// Form-specific type that matches the schema exactly
type TaskFormType = {
  title: string;
  overview: string;
  description: string;
  instructions: string;
  submissionInstructions: string;
  submitAsFile: boolean;
  submitAsText: boolean;
  submitAsUrl: boolean;
  background?: string | null;
  videoUrl?: string | null;
  internshipId: string;
  resources?: Array<{
    name: string;
    type: "FILE" | "URL";
    url?: string | null;
    description?: string | null;
    file?: string | null;
  }>;
};

interface TaskCreationWizardProps {
  onClose: () => void;
  internshipId: string | null;
}

// Local resource type for form state management (without taskId requirement)
type LocalResource = Omit<ResourceType, "taskId"> & { id: string };

const taskSteps = [
  { id: 1, title: "Overview", description: "Task background and context" },
  { id: 2, title: "Instructions", description: "Detailed task description" },
  { id: 3, title: "Resources", description: "Helpful materials and links" },
  { id: 4, title: "Submission", description: "How interns should submit" },
];

export default function TaskCreationWizard({
  onClose,
  internshipId,
}: TaskCreationWizardProps) {
  // Use LocalResource for state array to ensure a stable key (`id`)
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const utils = api.useUtils();
  const createTask = api.tasks.create.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate({ internshipId: internshipId! });
      toast.success("Task created successfully");
    },
  });

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      overview: "",
      description: "",
      instructions: "",
      submissionInstructions: "",
      submitAsFile: false,
      submitAsText: false,
      submitAsUrl: false,
      videoUrl: null,
      background: null,
      resources: [],
      internshipId: internshipId ?? "",
    },
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const progress = (currentStep / taskSteps.length) * 100;

  const handleAddResource = (type: ResourceType["type"]) => {
    const newResource: LocalResource = {
      // Generate a unique client-side ID for the array key
      id: crypto.randomUUID(),
      name: "",
      type: type,
      url: type === "URL" ? "" : null,
      description: "",
    } as LocalResource; // Cast to LocalResource

    setResources((prev) => [...prev, newResource]);
  };

  const handleRemoveResource = (idToRemove: string) => {
    setResources((prev) =>
      prev.filter((resource) => resource.id !== idToRemove),
    );
  };

  const handleResourceInputChange = (
    id: string,
    field: "name" | "url" | "description",
    value: string,
  ) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === id
          ? {
              ...resource,
              [field]: value,
            }
          : resource,
      ),
    );
  };

  // --- Navigation & Submission ---

  const handleNext = async () => {
    if (currentStep < taskSteps.length) {
      let isValid = true;
      let fieldsToValidate: (
        | "title"
        | "overview"
        | "description"
        | "instructions"
      )[] = [];

      if (currentStep === 1) {
        fieldsToValidate = ["title", "overview"];
      } else if (currentStep === 2) {
        fieldsToValidate = ["description", "instructions"];
      } else if (currentStep === 4) {
        // Validate submission types on the last step before proceeding to submit (or just submit)
        // Since we go to the last step here, we just need to validate before calling onSubmit.
      }

      if (fieldsToValidate.length > 0) {
        isValid = await form.trigger(fieldsToValidate);
      }

      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit: SubmitHandler<TaskFormType> = async (data: TaskFormType) => {
    if (!internshipId) {
      console.error("No internship ID provided");
      return;
    }

    try {
      await createTask.mutateAsync({
        ...data,
        internshipId,
        // Map local state resources to the expected TRPC format
        resources: resources
          .filter((r) => r.name && (r.url ?? r.type === "FILE")) 
          .map((r) => ({
            name: r.name,
            type: r.type,
            url: r.url ?? null,
            description: r.description ?? null,
            file: null, // File upload not implemented yet
          })),
      });

      // Optionally reset form and close modal
      form.reset();
      setResources([]);
      onClose();
    } catch (error) {
      toast.error(`Failed to create task`);
      console.log("Failed to create task:", error);
    }
  };

  const submissionTypes = watch([
    "submitAsFile",
    "submitAsUrl",
    "submitAsText",
  ]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Follow the steps to create a comprehensive task for your internship
          </DialogDescription>
        </DialogHeader>

        {/* Progress and Stepper */}
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

        <div>
          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Overview */}
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
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Create a Landing Page Design"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overview">Brief Overview *</Label>
                    <Textarea
                      id="overview"
                      placeholder="A short summary of what this task involves..."
                      className="min-h-[80px]"
                      {...register("overview")}
                    />
                    {errors.overview && (
                      <p className="text-sm text-red-500">
                        {errors.overview.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background">Background & Context</Label>
                    <Textarea
                      id="background"
                      placeholder="Provide context about why this task is important..."
                      className="min-h-[120px]"
                      {...register("background")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">
                      Introduction Video (Optional)
                    </Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://youtube.com/watch?v=..."
                      {...register("videoUrl")}
                    />
                    <p className="text-muted-foreground text-xs">
                      Add a video to explain the task context and expectations
                    </p>
                    {errors.videoUrl && (
                      <p className="text-sm text-red-500">
                        {errors.videoUrl.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Instructions */}
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
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Explain what the intern needs to accomplish in this task..."
                      className="min-h-[120px]"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">
                      Step-by-Step Instructions *
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder="1. First, do this...&#10;2. Then, do that...&#10;3. Finally, submit your work..."
                      className="min-h-[150px]"
                      {...register("instructions")}
                    />
                    {errors.instructions && (
                      <p className="text-sm text-red-500">
                        {errors.instructions.message}
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      Break down the task into clear, actionable steps
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Resources (FIXED LOGIC) */}
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
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleAddResource("FILE")}
                    >
                      <Upload className="h-4 w-4" />
                      Add File
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleAddResource("URL")}
                    >
                      <LinkIcon className="h-4 w-4" />
                      Add Link
                    </Button>
                  </div>

                  {resources.length === 0 ? (
                    <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed py-8 text-center">
                      <FileText className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
                      <p className="text-muted-foreground text-sm">
                        No resources added yet
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Add files or links to help interns complete this task
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resources.map((resource) => (
                        <Card key={resource.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded">
                                {resource.type === "FILE" ? (
                                  <Upload className="h-4 w-4" />
                                ) : (
                                  <LinkIcon className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <Input
                                  placeholder="Resource name"
                                  value={resource.name}
                                  onChange={(e) =>
                                    handleResourceInputChange(
                                      resource.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Input
                                  placeholder={
                                    resource.type === "URL"
                                      ? "https://..."
                                      : "Resource URL or path (for reference only)"
                                  }
                                  value={resource.url ?? ""}
                                  onChange={(e) =>
                                    handleResourceInputChange(
                                      resource.id,
                                      "url",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Input
                                  placeholder="Brief description (optional)"
                                  value={resource.description ?? ""}
                                  onChange={(e) =>
                                    handleResourceInputChange(
                                      resource.id,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveResource(resource.id)
                                }
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

            {/* Step 4: Submission */}
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
                          id="submitAsFile"
                          checked={watch("submitAsFile")}
                          onCheckedChange={(checked) =>
                            setValue("submitAsFile", checked as boolean, {
                              shouldValidate: true,
                            })
                          }
                        />
                        <Label
                          htmlFor="submitAsFile"
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          File Upload
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="submitAsUrl"
                          checked={watch("submitAsUrl")}
                          onCheckedChange={(checked) =>
                            setValue("submitAsUrl", checked as boolean, {
                              shouldValidate: true,
                            })
                          }
                        />
                        <Label
                          htmlFor="submitAsUrl"
                          className="flex items-center gap-2"
                        >
                          <LinkIcon className="h-4 w-4" />
                          URL/Link Submission
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="submitAsText"
                          checked={watch("submitAsText")}
                          onCheckedChange={(checked) =>
                            setValue("submitAsText", checked as boolean, {
                              shouldValidate: true,
                            })
                          }
                        />
                        <Label
                          htmlFor="submitAsText"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Text Response
                        </Label>
                      </div>
                    </div>
                    {(errors.submitAsFile ??
                      (!submissionTypes[0] &&
                        !submissionTypes[1] &&
                        !submissionTypes[2] &&
                        form.formState.isSubmitted)) && (
                      <p className="text-sm text-red-500">
                        At least one submission type is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submissionInstructions">
                      Submission Instructions
                    </Label>
                    <Textarea
                      id="submissionInstructions"
                      placeholder="Provide specific instructions on what to include in the submission, file formats, naming conventions, etc..."
                      className="min-h-[100px]"
                      {...register("submissionInstructions")}
                    />
                  </div>

                  {(submissionTypes[0] ||
                    submissionTypes[1] ||
                    submissionTypes[2]) && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="mb-2 font-medium">
                        Selected submission types:
                      </h4>
                      <div className="flex gap-2">
                        {submissionTypes[0] && (
                          <Badge variant="secondary">File Upload</Badge>
                        )}
                        {submissionTypes[1] && (
                          <Badge variant="secondary">URL/Link</Badge>
                        )}
                        {submissionTypes[2] && (
                          <Badge variant="secondary">Text Response</Badge>
                        )}
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
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < taskSteps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                  disabled={createTask.isPending}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button" // Keep as button but handle manually
                  onClick={async () => {
                    console.log("🎯 Create Task button clicked");

                    // Validate all fields including submission types
                    const isValid = await form.trigger(undefined, {
                      shouldFocus: true,
                    });

                    if (!isValid) {
                      console.log(
                        "❌ Form validation failed",
                        form.formState.errors,
                      );
                      console.log("form values", form.getValues());
                      toast.error(
                        "Please fix the form errors before submitting",
                      );
                      return;
                    }

                    // Manually check submission types
                    const formData = form.getValues();
                    if (
                      !formData.submitAsFile &&
                      !formData.submitAsUrl &&
                      !formData.submitAsText
                    ) {
                      toast.error("Please select at least one submission type");
                      return;
                    }

                    if (!internshipId) {
                      toast.error("No internship ID provided");
                      return;
                    }

                    console.log("✅ All validations passed, calling onSubmit");
                    await onSubmit(formData);
                  }}
                  className="flex items-center gap-2"
                  disabled={createTask.isPending || !internshipId}
                >
                  {createTask.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Create Task
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
