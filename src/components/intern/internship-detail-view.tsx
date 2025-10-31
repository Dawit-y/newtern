"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Target,
  BookOpen,
  Award,
  AlertCircle,
  ExternalLink,
  Send,
  FileText,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface InternshipDetailViewProps {
  internship: {
    id: number;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    type: string;
    duration: string;
    deadline: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    tasks: number;
    applicants: number;
    salary?: string;
    applicationStatus?: "not-applied" | "pending" | "rejected" | "accepted";
    benefits?: string[];
    aboutCompany?: string;
    learningOutcomes?: string[];
  };
}

export default function InternshipDetailView({
  internship,
}: InternshipDetailViewProps) {
  const getStatusBadge = () => {
    switch (internship.applicationStatus) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Application Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Application Rejected
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Accepted
          </Badge>
        );
      default:
        return null;
    }
  };

  const canApply =
    !internship.applicationStatus ||
    internship.applicationStatus === "not-applied";
  const isPending = internship.applicationStatus === "pending";

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage src={internship.companyLogo ?? "/placeholder.svg"} />
              <AvatarFallback>
                <Building2 className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold">{internship.title}</h1>
                  <Badge variant="default">{internship.type}</Badge>
                  {getStatusBadge()}
                </div>
                <p className="text-muted-foreground text-lg">
                  {internship.company}
                </p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Apply by: {internship.deadline}</span>
                </div>
                {internship.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                    <span>{internship.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span>{internship.applicants} applicants</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 border-t pt-6">
            {canApply && (
              <Button size="lg" asChild>
                <Link
                  href={`/dashboard/intern/internship/${internship.id}/apply`}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Apply Now
                </Link>
              </Button>
            )}
            {isPending && (
              <Button size="lg" disabled>
                <Clock className="mr-2 h-4 w-4" />
                Application Under Review
              </Button>
            )}
            <Button size="lg" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Company Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="program">Program Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                About This Internship
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {internship.description}
              </p>

              {internship.aboutCompany && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                      <Building2 className="h-4 w-4" />
                      About {internship.company}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {internship.aboutCompany}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {internship.benefits && internship.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {internship.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {internship.learningOutcomes &&
            internship.learningOutcomes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    What You&apos;ll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {internship.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground pt-0.5 text-sm">
                          {outcome}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        <TabsContent value="responsibilities" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Responsibilities
              </CardTitle>
              <CardDescription>
                What you&apos;ll be working on during this internship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {internship.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground pt-0.5">
                      {responsibility}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Requirements & Qualifications
              </CardTitle>
              <CardDescription>
                What we&apos;re looking for in candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {internship.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <p className="text-muted-foreground">{requirement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Program Structure
              </CardTitle>
              <CardDescription>
                Overview of tasks and learning path
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">Total Tasks</h4>
                  </div>
                  <p className="text-3xl font-bold">{internship.tasks}</p>
                  <p className="text-muted-foreground text-sm">
                    Structured learning modules
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">Duration</h4>
                  </div>
                  <p className="text-3xl font-bold">
                    {internship.duration.split(" ")[0]}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {internship.duration.split(" ").slice(1).join(" ")}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Award className="text-primary h-5 w-5" />
                    <h4 className="font-semibold">Certificate</h4>
                  </div>
                  <p className="text-3xl font-bold">Yes</p>
                  <p className="text-muted-foreground text-sm">
                    Upon completion
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-3 font-semibold">What to Expect</h4>
                <div className="space-y-3">
                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h5 className="mb-1 font-medium">Onboarding & Setup</h5>
                      <p className="text-muted-foreground text-sm">
                        Get familiar with tools, meet your mentor, and set up
                        your development environment
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h5 className="mb-1 font-medium">Hands-on Projects</h5>
                      <p className="text-muted-foreground text-sm">
                        Work on {internship.tasks} progressive tasks with
                        real-world applications and challenges
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h5 className="mb-1 font-medium">
                        Mentorship & Feedback
                      </h5>
                      <p className="text-muted-foreground text-sm">
                        Regular check-ins with your mentor and detailed feedback
                        on all submissions
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h5 className="mb-1 font-medium">
                        Final Project & Certificate
                      </h5>
                      <p className="text-muted-foreground text-sm">
                        Showcase your skills in a capstone project and receive
                        your completion certificate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <h4 className="mb-2 font-semibold">Application Deadline</h4>
                  <p className="text-muted-foreground mb-4">
                    Applications close on{" "}
                    <span className="text-foreground font-semibold">
                      {internship.deadline}
                    </span>
                    . Don&apos;t miss your chance to join this amazing
                    opportunity!
                  </p>
                  {canApply && (
                    <Button asChild>
                      <Link
                        href={`/dashboard/intern/internship/${internship.id}/apply`}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Apply Now
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
