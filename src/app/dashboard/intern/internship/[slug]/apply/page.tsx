"use client";

import type React from "react";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ApplicationStatusCard from "@/components/intern/application-status-card";
import {
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  Mail,
  Phone,
  MapPinned,
  Send,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ApplicationFormData {
  coverLetterFile: FileList;
  resumeFile?: FileList;
  availability: string;
}

export default function ApplyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ApplicationFormData>();
  const { slug } = useParams();
  const { data: profile } = api.profiles.getCurrentProfile.useQuery();
  const { data: internship } = api.internships.bySlug.useQuery(slug as string);

  const createApplication = api.applications.create.useMutation();
  const router = useRouter();

  const [selectedCoverLetterFile, setSelectedCoverLetterFile] =
    useState<File | null>(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  if (!profile || profile.type !== "intern") {
    return <div>Not an intern profile</div>;
  }

  const hasProfileResume = !!profile.resume;

  const uploadFile = async (
    file: File,
    type: "cover-letter" | "resume",
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? "Upload failed");
      }

      const result = (await response.json()) as { filePath: string };
      return result.filePath;
    } catch (error) {
      console.error("File upload error:", error);
      return null;
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!internship) {
      console.error("No internship data available");
      return;
    }

    setIsUploading(true);

    try {
      let coverLetterPath: string | null = null;
      let resumePath: string | null = null;

      // Upload cover letter if provided
      if (data.coverLetterFile[0]) {
        coverLetterPath = await uploadFile(
          data.coverLetterFile[0],
          "cover-letter",
        );
        if (!coverLetterPath) {
          throw new Error("Failed to upload cover letter");
        }
      }

      // Upload resume if provided
      if (data.resumeFile?.[0]) {
        resumePath = await uploadFile(data.resumeFile[0], "resume");
        if (!resumePath) {
          throw new Error("Failed to upload resume");
        }
      }

      // Prepare the application data
      const applicationData = {
        internId: profile.id,
        internshipId: internship.id,
        availability: data.availability,
        coverLetter: coverLetterPath,
        resume: resumePath,
      };

      // Call the mutation with the proper data structure
      await createApplication.mutateAsync(applicationData);

      // Redirect on success
      router.push("/dashboard/intern");
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast.error("Failed to submit application")
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedCoverLetterFile(file);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedResumeFile(file);
  };

  const isFormValid = watch("coverLetterFile")?.[0] && watch("availability");

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Profile Summary Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Your Profile</CardTitle>
            <CardDescription>Information from your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="text-muted-foreground text-xs">
                  {profile.user.email}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <div className="text-muted-foreground text-xs">Email</div>
                  <div>{profile.user.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <div className="text-muted-foreground text-xs">Phone</div>
                  <div>{profile.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPinned className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <div className="text-muted-foreground text-xs">Location</div>
                  <div>{profile.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <GraduationCap className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <div className="text-muted-foreground text-xs">Education</div>
                  <div>{profile.university}</div>
                  <div className="text-muted-foreground text-xs">
                    {profile.major} • {profile.graduationYear}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {Array.isArray(profile?.skills) && profile.skills.length > 0 && (
              <div>
                <div className="text-muted-foreground mb-2 text-xs">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="text-muted-foreground text-xs">
              <Link
                href="/dashboard/intern/profile"
                className="text-primary hover:underline"
              >
                Edit profile information
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      {internship?.userApplication ? (
        <div className="lg:col-span-2">
          <ApplicationStatusCard
            status={internship.userApplication.status}
            internshipSlug={internship.slug}
          />
        </div>
      ) : (
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Apply for {internship?.title} at{" "}
                {internship?.organization.organizationName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Cover Letter File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetterFile">
                    Cover Letter <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="coverLetterFile"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      {...register("coverLetterFile", {
                        required: "Cover letter is required",
                        validate: {
                          fileType: (files) => {
                            if (!files?.[0]) return "Cover letter is required";
                            const allowedTypes = [
                              "application/pdf",
                              "application/msword",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              "text/plain",
                            ];
                            const file = files[0];
                            if (!allowedTypes.includes(file.type)) {
                              return "Please upload a PDF, DOC, DOCX, or TXT file";
                            }
                            return true;
                          },
                          fileSize: (files) => {
                            if (!files?.[0]) return true;
                            const file = files[0];
                            if (file.size > 5 * 1024 * 1024) {
                              // 5MB
                              return "File size must be less than 5MB";
                            }
                            return true;
                          },
                        },
                      })}
                      onChange={handleCoverLetterChange}
                      className="flex-1"
                    />
                    {selectedCoverLetterFile && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileText className="h-4 w-4" />
                        {selectedCoverLetterFile.name}
                      </div>
                    )}
                  </div>
                  {errors.coverLetterFile && (
                    <p className="text-destructive text-xs">
                      {errors.coverLetterFile.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    PDF, DOC, DOCX, or TXT files accepted (max 5MB)
                  </p>
                </div>

                {/* Resume File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resumeFile">
                    Resume{" "}
                    {!hasProfileResume && (
                      <span className="text-destructive">*</span>
                    )}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="resumeFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      {...register("resumeFile", {
                        required: !hasProfileResume
                          ? "Resume is required"
                          : false,
                        validate: {
                          fileType: (files) => {
                            if (!files?.[0]) {
                              if (!hasProfileResume)
                                return "Resume is required";
                              return true;
                            }
                            const allowedTypes = [
                              "application/pdf",
                              "application/msword",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            ];
                            const file = files[0];
                            if (!allowedTypes.includes(file.type)) {
                              return "Please upload a PDF, DOC, or DOCX file";
                            }
                            return true;
                          },
                          fileSize: (files) => {
                            if (!files?.[0]) return true;
                            const file = files[0];
                            if (file.size > 5 * 1024 * 1024) {
                              // 5MB
                              return "File size must be less than 5MB";
                            }
                            return true;
                          },
                        },
                      })}
                      onChange={handleResumeChange}
                      className="flex-1"
                    />
                    {selectedResumeFile && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileText className="h-4 w-4" />
                        {selectedResumeFile.name}
                      </div>
                    )}
                  </div>
                  {errors.resumeFile && (
                    <p className="text-destructive text-xs">
                      {errors.resumeFile.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    PDF, DOC, or DOCX files accepted (max 5MB)
                  </p>
                  {!hasProfileResume && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Notice:</strong> You haven&apos;t attached a
                        resume to your profile. Please upload your resume to
                        complete your application.
                      </p>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability">
                    Availability <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="availability"
                    placeholder="e.g., Immediately, January 2025, After Finals (May 2025)"
                    {...register("availability", {
                      required: "Availability is required",
                      minLength: {
                        value: 2,
                        message: "Availability must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.availability && (
                    <p className="text-destructive text-xs">
                      {errors.availability.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    When can you start this internship?
                  </p>
                </div>

                {/* Info Box */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div className="text-sm">
                      <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                        Your profile information will be included
                      </p>
                      <p className="text-blue-800 dark:text-blue-200">
                        We&apos;ll automatically include your contact details,
                        education, skills, and profile information with this
                        application.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href={`/dashboard/intern/internship/${internship?.slug}`}
                  >
                    <Button variant="outline" type="button">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={
                      !isFormValid ||
                      isSubmitting ||
                      createApplication.isPending ||
                      isUploading
                    }
                    size="lg"
                  >
                    {isSubmitting ||
                    createApplication.isPending ||
                    isUploading ? (
                      <>
                        <span className="mr-2">
                          {isUploading ? "Uploading files..." : "Submitting..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">Submit Application</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
