"use client";

import type React from "react";

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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileText,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock internship data
const internshipData = {
  id: 1,
  title: "Frontend Developer Intern",
  company: "TechStart Inc.",
  companyLogo: "/placeholder.svg?height=80&width=80",
  location: "Remote",
  type: "Paid",
  duration: "3 months",
  deadline: "Dec 15, 2024",
  description:
    "Work on real-world React projects and build modern web applications. You'll be part of our frontend team, contributing to our main product and learning from experienced developers.",
  responsibilities: [
    "Develop and maintain React components",
    "Collaborate with the design team to implement UI/UX",
    "Write clean, maintainable code following best practices",
    "Participate in code reviews and team meetings",
    "Learn and apply new technologies",
  ],
  requirements: [
    "Currently enrolled in Computer Science or related field",
    "Basic knowledge of React and JavaScript",
    "Understanding of HTML/CSS",
    "Good communication skills",
    "Willingness to learn and adapt",
  ],
  skills: ["React", "TypeScript", "CSS", "JavaScript"],
  tasks: 5,
  applicants: 23,
};

const applicationSteps = [
  { id: 1, title: "Personal Info", description: "Basic information" },
  { id: 2, title: "Experience", description: "Skills and background" },
  { id: 3, title: "Documents", description: "Resume and portfolio" },
  { id: 4, title: "Review", description: "Submit application" },
];

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    // Experience
    university: "",
    major: "",
    graduationYear: "",
    gpa: "",
    skills: "",
    experience: "",
    // Documents
    resume: null as File | null,
    portfolio: "",
    linkedin: "",
    github: "",
    // Additional
    coverLetter: "",
    availability: "",
    whyInterested: "",
  });

  const progress = (currentStep / applicationSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < applicationSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Application submitted:", formData);
    router.push("/dashboard/intern?applicationSubmitted=true");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 items-center border-b px-4 backdrop-blur lg:px-6">
        <Link
          href="/dashboard/intern"
          className="flex items-center justify-center"
        >
          <Briefcase className="text-primary h-8 w-8" />
          <span className="text-primary ml-2 text-2xl font-bold">Newtern</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/dashboard/intern"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/intern/browse"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Browse
          </Link>
        </nav>
        <div className="ml-6 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="from-background to-muted/20 flex-1 bg-gradient-to-b">
        <div className="container px-4 py-8 md:px-6">
          {/* Back Button */}
          <Link href="/dashboard/intern/browse">
            <Button variant="ghost" className="mb-6 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Button>
          </Link>

          {/* Internship Summary */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarFallback>
                    <Building2 className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      {internshipData.title}
                    </h1>
                    <Badge variant="default">{internshipData.type}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 text-lg">
                    {internshipData.company}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <span>{internshipData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span>{internshipData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span>Deadline: {internshipData.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Progress Steps */}
            <div className="lg:col-span-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Application Progress</CardTitle>
                  <CardDescription>
                    Complete all steps to submit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Step {currentStep} of {applicationSteps.length}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    {applicationSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-start gap-3 ${
                          step.id === currentStep
                            ? "text-primary"
                            : step.id < currentStep
                              ? "text-muted-foreground"
                              : "text-muted-foreground/50"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                            step.id === currentStep
                              ? "border-primary bg-primary text-primary-foreground"
                              : step.id < currentStep
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/50"
                          }`}
                        >
                          {step.id < currentStep ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{step.title}</div>
                          <div className="text-xs">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {applicationSteps[currentStep - 1].title}
                  </CardTitle>
                  <CardDescription>
                    {applicationSteps[currentStep - 1].description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            placeholder="San Francisco, CA"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Experience */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="university">
                            University/College *
                          </Label>
                          <Input
                            id="university"
                            placeholder="Stanford University"
                            value={formData.university}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                university: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="major">Major/Field of Study *</Label>
                          <Input
                            id="major"
                            placeholder="Computer Science"
                            value={formData.major}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                major: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="graduationYear">
                            Expected Graduation Year *
                          </Label>
                          <Input
                            id="graduationYear"
                            placeholder="2025"
                            value={formData.graduationYear}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                graduationYear: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gpa">GPA (Optional)</Label>
                          <Input
                            id="gpa"
                            placeholder="3.8"
                            value={formData.gpa}
                            onChange={(e) =>
                              setFormData({ ...formData, gpa: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Relevant Skills *</Label>
                        <Textarea
                          id="skills"
                          placeholder="List your skills (e.g., React, TypeScript, Node.js, Python...)"
                          className="min-h-[100px]"
                          value={formData.skills}
                          onChange={(e) =>
                            setFormData({ ...formData, skills: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">
                          Previous Experience (Optional)
                        </Label>
                        <Textarea
                          id="experience"
                          placeholder="Describe any relevant projects, internships, or work experience..."
                          className="min-h-[120px]"
                          value={formData.experience}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              experience: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="resume">Resume/CV *</Label>
                        <div className="border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                          <Upload className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
                          <Label htmlFor="resume" className="cursor-pointer">
                            <span className="text-primary text-sm hover:underline">
                              Click to upload
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {" "}
                              or drag and drop
                            </span>
                            <Input
                              id="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </Label>
                          <p className="text-muted-foreground mt-2 text-xs">
                            PDF, DOC, or DOCX up to 5MB
                          </p>
                        </div>

                        {formData.resume && (
                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="text-muted-foreground h-4 w-4" />
                              <span className="text-sm">
                                {formData.resume.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setFormData({ ...formData, resume: null })
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="portfolio">Portfolio Website</Label>
                          <Input
                            id="portfolio"
                            type="url"
                            placeholder="https://yourportfolio.com"
                            value={formData.portfolio}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                portfolio: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn Profile</Label>
                          <Input
                            id="linkedin"
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={formData.linkedin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                linkedin: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub Profile</Label>
                          <Input
                            id="github"
                            type="url"
                            placeholder="https://github.com/yourusername"
                            value={formData.github}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                github: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="coverLetter">Cover Letter *</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell us why you're interested in this internship and what makes you a great fit..."
                          className="min-h-[150px]"
                          value={formData.coverLetter}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              coverLetter: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability">Availability *</Label>
                        <Input
                          id="availability"
                          placeholder="e.g., Immediately, January 2025, Flexible"
                          value={formData.availability}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              availability: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="mb-4 font-semibold">
                          Application Summary
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                              Personal Information
                            </h4>
                            <p className="text-sm">
                              {formData.firstName} {formData.lastName}
                            </p>
                            <p className="text-sm">{formData.email}</p>
                            <p className="text-sm">{formData.phone}</p>
                            <p className="text-sm">{formData.location}</p>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                              Education
                            </h4>
                            <p className="text-sm">
                              {formData.university} • {formData.major}
                            </p>
                            <p className="text-sm">
                              Expected Graduation: {formData.graduationYear}
                            </p>
                            {formData.gpa && (
                              <p className="text-sm">GPA: {formData.gpa}</p>
                            )}
                          </div>

                          <Separator />

                          <div>
                            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                              Documents
                            </h4>
                            <p className="text-sm">
                              Resume:{" "}
                              {formData.resume
                                ? formData.resume.name
                                : "Not uploaded"}
                            </p>
                            {formData.portfolio && (
                              <p className="text-sm">
                                Portfolio: {formData.portfolio}
                              </p>
                            )}
                            {formData.linkedin && (
                              <p className="text-sm">
                                LinkedIn: {formData.linkedin}
                              </p>
                            )}
                            {formData.github && (
                              <p className="text-sm">
                                GitHub: {formData.github}
                              </p>
                            )}
                          </div>

                          <Separator />

                          <div>
                            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                              Availability
                            </h4>
                            <p className="text-sm">{formData.availability}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                        <div className="flex items-start gap-2">
                          <Star className="mt-0.5 h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">
                              Ready to Submit?
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              Please review all information carefully. Once
                              submitted, you'll receive a confirmation email and
                              the organization will review your application.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex items-center justify-between border-t pt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1 || isSubmitting}
                      className="bg-transparent"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < applicationSteps.length ? (
                      <Button onClick={handleNext}>
                        Next
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
