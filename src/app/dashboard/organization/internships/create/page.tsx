"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type InternshipType,
  internshipSchema,
} from "@/lib/validation/internships";
import { api } from "@/trpc/react";
import { useOrganizationProfile } from "@/hooks/use-profile";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import BasicInformationStep from "@/components/organization/basic-information-step";
import TasksStep from "@/components/organization/tasks-step";
import ReviewStep from "@/components/organization/review-step";

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

export default function CreateInternshipPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdInternshipId, setCreatedInternshipId] = useState<string | null>(
    null,
  );
  const { organizationId, isLoading: isProfileLoading } =
    useOrganizationProfile();

  const createInternship = api.internships.create.useMutation({
    onSuccess: (data) => {
      setCreatedInternshipId(data.id);
    },
  });

  const publishInternship = api.internships.publish.useMutation();

  const form = useForm<InternshipType>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      type: undefined,
      location: "",
      requirements: null,
      skills: [],
      deadline: new Date(),
      organizationId: organizationId ?? "",
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 1) {
      // Wait for profile to load
      if (isProfileLoading || !organizationId) {
        console.log("Waiting for profile to load...");
        return;
      }
      const isValid = await form.trigger();
      if (!isValid) return;
      try {
        const formData = form.getValues();
        const formattedData = {
          ...formData,
          deadline: new Date(formData.deadline),
        };
        const result = await createInternship.mutateAsync(formattedData);
        setCreatedInternshipId(result.id);
        setCurrentStep(2);
      } catch (error) {
        console.error("Failed to create internship:", error);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (!createdInternshipId) return;

    try {
      await publishInternship.mutateAsync({
        internshipId: createdInternshipId,
      });
      router.push("/dashboard/organization/internships");
    } catch (error) {
      console.error("Failed to publish internship:", error);
    }
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
            {currentStep === 1 && <BasicInformationStep form={form} />}

            {currentStep === 2 && (
              <TasksStep internshipId={createdInternshipId} />
            )}

            {currentStep === 3 && (
              <ReviewStep internshipId={createdInternshipId} />
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
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
              disabled={currentStep === 2 && !createdInternshipId}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              className="flex items-center gap-2"
              disabled={publishInternship.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              {publishInternship.isPending
                ? "Publishing..."
                : "Publish Internship"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
