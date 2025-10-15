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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  Mail,
  Phone,
  MapPinned,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock internship data
const internshipData = {
  id: 1,
  title: "Frontend Developer Intern",
  company: "TechStart Inc.",
  location: "Remote",
  type: "Paid",
  duration: "3 months",
  deadline: "Dec 15, 2024",
  description:
    "Work on real-world React projects and build modern web applications. You'll be part of our frontend team, contributing to our main product and learning from experienced developers.",
  skills: ["React", "TypeScript", "CSS", "JavaScript"],
  tasks: 5,
  applicants: 23,
};

// Mock user profile data (would come from database/auth)
const userProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  university: "Stanford University",
  major: "Computer Science",
  graduationYear: "2025",
  gpa: "3.8",
  skills: ["React", "TypeScript", "Node.js", "Python", "CSS"],
  resumeUrl: "/resume/john-doe-resume.pdf",
  portfolioUrl: "https://johndoe.dev",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  githubUrl: "https://github.com/johndoe",
};

export default function ApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    whyInterested: "",
    relevantExperience: "",
    availability: "",
    portfolioLinks: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Application submitted:", {
      ...formData,
      profile: userProfile,
    });
    router.push("/dashboard/intern?applicationSubmitted=true");
  };

  const isFormValid =
    formData.coverLetter && formData.whyInterested && formData.availability;

  return (
    <>
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
                    {userProfile.firstName[0]}
                    {userProfile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {userProfile.firstName} {userProfile.lastName}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {userProfile.email}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div>
                    <div className="text-muted-foreground text-xs">Email</div>
                    <div>{userProfile.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div>
                    <div className="text-muted-foreground text-xs">Phone</div>
                    <div>{userProfile.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPinned className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div>
                    <div className="text-muted-foreground text-xs">
                      Location
                    </div>
                    <div>{userProfile.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <GraduationCap className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div>
                    <div className="text-muted-foreground text-xs">
                      Education
                    </div>
                    <div>{userProfile.university}</div>
                    <div className="text-muted-foreground text-xs">
                      {userProfile.major} • {userProfile.graduationYear}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-muted-foreground mb-2 text-xs">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {userProfile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

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

        {/* Application Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Tell us why you&apos;re interested in this specific internship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">
                    Cover Letter <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Introduce yourself and explain why you're applying for this internship. Highlight what makes you a great fit for this role..."
                    className="min-h-[180px]"
                    value={formData.coverLetter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coverLetter: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-muted-foreground text-xs">
                    {formData.coverLetter.length} characters
                  </p>
                </div>

                {/* Why Interested */}
                <div className="space-y-2">
                  <Label htmlFor="whyInterested">
                    Why are you interested in this internship?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="whyInterested"
                    placeholder="What specific aspects of this internship excite you? How does it align with your career goals?"
                    className="min-h-[120px]"
                    value={formData.whyInterested}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whyInterested: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Relevant Experience */}
                <div className="space-y-2">
                  <Label htmlFor="relevantExperience">
                    Relevant Experience (Optional)
                  </Label>
                  <Textarea
                    id="relevantExperience"
                    placeholder="Describe any projects, coursework, or experience relevant to this specific internship..."
                    className="min-h-[120px]"
                    value={formData.relevantExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relevantExperience: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability">
                    Availability <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="availability"
                    placeholder="e.g., Immediately, January 2025, After Finals (May 2025)"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-muted-foreground text-xs">
                    When can you start this internship?
                  </p>
                </div>

                {/* Portfolio Links */}
                <div className="space-y-2">
                  <Label htmlFor="portfolioLinks">
                    Relevant Portfolio Links (Optional)
                  </Label>
                  <Textarea
                    id="portfolioLinks"
                    placeholder="Share links to projects, GitHub repos, or work samples relevant to this internship (one per line)"
                    className="min-h-[100px]"
                    value={formData.portfolioLinks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portfolioLinks: e.target.value,
                      })
                    }
                  />
                  <p className="text-muted-foreground text-xs">
                    Your main portfolio/GitHub from profile will be
                    automatically included
                  </p>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Anything else you'd like the organization to know?"
                    className="min-h-[100px]"
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalInfo: e.target.value,
                      })
                    }
                  />
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
                        education, skills, resume, and profile links with this
                        application.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  <Link
                    href={`/dashboard/intern/internship/${internshipData.id}`}
                  >
                    <Button variant="outline" type="button">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Submitting...</span>
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
      </div>
    </>
  );
}
