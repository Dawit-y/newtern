"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  internProfileFormSchema,
  type InternProfileInput,
} from "@/lib/validation/profile";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Briefcase,
  LinkIcon,
  Save,
  Upload,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience & Skills", icon: Briefcase },
  { id: "links", label: "Links & Resume", icon: LinkIcon },
];

export default function InternProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: currentProfile, isLoading } =
    api.profiles.getCurrentProfile.useQuery();
  const internProfile =
    currentProfile?.type === "intern" ? currentProfile : null;

  const updateProfile = api.profiles.updateInternProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      localStorage.removeItem("profileDraft");
    },
    onError: (err) => toast.error(err.message || "Failed to update"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
    trigger,
  } = useForm<InternProfileInput>({
    resolver: zodResolver(internProfileFormSchema),
    defaultValues: { resume: null },
  });

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const resumeFile = watch("resume");

  // Prefill form
  useEffect(() => {
    if (internProfile) {
      const { user, ...data } = internProfile;
      // Exclude resume as it's a File in form but string in DB
      Object.entries(data)
        .filter(([key]) => key !== "resume")
        .forEach(([key, value]) => {
          setValue(key as keyof InternProfileInput, value ?? ("" as never));
        });
      setAvatarPreview(user?.image ?? "");
    }
  }, [internProfile, setValue]);

  // Avatar preview
  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  // Auto-save draft
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        const values = watch();
        // Exclude File objects from draft (can't be serialized)
        const draftData = Object.fromEntries(
          Object.entries(values).filter(
            ([, value]) => !(value instanceof File),
          ),
        );
        localStorage.setItem("profileDraft", JSON.stringify(draftData));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [watch, isDirty]);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem("profileDraft");
    if (draft && !internProfile) {
      try {
        const parsed = JSON.parse(draft) as Record<string, unknown>;
        Object.entries(parsed).forEach(([k, v]) => {
          if (k !== "resume" && k !== "avatar") {
            setValue(k as keyof InternProfileInput, v as never);
          }
        });
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [setValue, internProfile]);

  const onSubmit = async (data: InternProfileInput) => {
    try {
      let resumePath: string | null = null;
      let avatarPath: string | null = null;

      // Upload resume file if provided
      if (data.resume instanceof File && data.resume.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", data.resume);
        uploadFormData.append("type", "profile-resume");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const error = (await uploadResponse.json()) as { error?: string };
          throw new Error(error.error ?? "Failed to upload resume");
        }

        const uploadResult = (await uploadResponse.json()) as {
          filePath: string;
        };
        resumePath = uploadResult.filePath;
      }

      // Upload avatar if provided
      if (avatarFile instanceof File && avatarFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", avatarFile);
        uploadFormData.append("type", "avatar");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const error = (await uploadResponse.json()) as { error?: string };
          throw new Error(error.error ?? "Failed to upload avatar");
        }

        const uploadResult = (await uploadResponse.json()) as {
          filePath: string;
        };
        avatarPath = uploadResult.filePath;
      }

      // Prepare data for tRPC (without File objects)
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        university: data.university,
        major: data.major ?? null,
        skills: data.skills ?? null,
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        linkedin: data.linkedin ?? null,
        github: data.github ?? null,
        portfolio: data.portfolio ?? null,
        location: data.location ?? null,
        graduationYear: data.graduationYear ?? null,
        gpa: data.gpa ?? null,
        experience: data.experience ?? null,
        resume: resumePath ?? internProfile?.resume ?? null,
        image: avatarPath ?? undefined,
      };

      await updateProfile.mutateAsync(updateData);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-background fixed inset-y-0 left-0 w-64 p-4 shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-6 lg:hidden">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ring-offset-background focus:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center px-6 pb-6">
              <div className="relative">
                <Avatar className="ring-muted hover:ring-muted-foreground/20 h-28 w-28 cursor-pointer ring-4 transition-all">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                  <AvatarFallback className="text-3xl">
                    {internProfile?.firstName?.[0]}
                    {internProfile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-1 -bottom-1 rounded-full p-2 shadow-lg transition-colors"
                >
                  <Upload className="h-4 w-4" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (file) {
                      setAvatarFile(file);
                    }
                  }}
                />
              </div>

              <h3 className="text-foreground mt-4 text-xl font-bold">
                {watch("firstName") || "Your"} {watch("lastName") || "Name"}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {watch("major") ?? "Major"}
              </p>
              <Badge variant="secondary" className="mt-2">
                Class of {watch("graduationYear") ?? "20XX"}
              </Badge>
            </div>

            <Separator />

            <nav className="flex-1 space-y-1 p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl font-bold">
                  Edit Profile
                </CardTitle>
                <CardDescription>
                  {tabs.find((t) => t.id === activeTab)?.label}
                </CardDescription>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="ring-offset-background focus:ring-ring rounded-sm p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          placeholder="John"
                          className={
                            errors.firstName ? "border-destructive" : ""
                          }
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-sm">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          placeholder="Doe"
                          className={
                            errors.lastName ? "border-destructive" : ""
                          }
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-sm">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="+251 911 223 344"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          {...register("location")}
                          placeholder="Addis Ababa, Ethiopia"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          {...register("bio")}
                          rows={4}
                          placeholder="Passionate CS student seeking internship..."
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Education */}
                {activeTab === "education" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="university">University *</Label>
                      <Input
                        id="university"
                        {...register("university")}
                        placeholder="Addis Ababa University"
                        className={
                          errors.university ? "border-destructive" : ""
                        }
                      />
                      {errors.university && (
                        <p className="text-destructive text-sm">
                          {errors.university.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          {...register("major")}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          {...register("graduationYear")}
                          placeholder="2026"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA (out of 4.0)</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        {...register("gpa", { valueAsNumber: true })}
                        placeholder="3.85"
                      />
                    </div>
                  </div>
                )}

                {/* Experience & Skills */}
                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        {...register("experience")}
                        rows={6}
                        placeholder="• Built full-stack web app with Next.js\n• Led team of 3..."
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        {...register("skills")}
                        placeholder="React, TypeScript, Python, AWS"
                      />
                    </div>
                  </div>
                )}

                {/* Links & Resume */}
                {activeTab === "links" && (
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          {...register("linkedin")}
                          placeholder="https://linkedin.com/in/you"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          {...register("github")}
                          placeholder="https://github.com/you"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio</Label>
                      <Input
                        id="portfolio"
                        {...register("portfolio")}
                        placeholder="https://yourname.dev"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume (PDF, DOCX)</Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("resume", file, { shouldDirty: true });
                            void trigger("resume");
                          }
                        }}
                        className={errors.resume ? "border-destructive" : ""}
                      />
                      {resumeFile instanceof File ? (
                        <p className="mt-2 text-sm text-green-600">
                          Selected: {resumeFile.name} (
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      ) : internProfile?.resume ? (
                        <p className="text-muted-foreground mt-2 text-sm">
                          Current: {internProfile.resume.split("/").pop()}
                        </p>
                      ) : null}
                      {errors.resume && (
                        <p className="text-destructive text-sm">
                          {errors.resume.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info("Draft saved locally")}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
