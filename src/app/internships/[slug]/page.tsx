"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function InternshipDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const {
    data: internship,
    isLoading,
    error,
  } = api.internships.bySlug.useQuery(slug as string);

  // Handle 404
  if (!isLoading && !internship) {
    notFound();
  }

  // Handle errors
  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load internship. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Back Button */}
      <div className="bg-muted/40 border-b">
        <div className="container flex items-center gap-2 py-3 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Button>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        {isLoading ? (
          <InternshipDetailSkeleton />
        ) : internship ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                      {internship.title}
                    </h1>
                    <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {internship.organization.organizationName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {internship.location}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      internship.type === "PAID"
                        ? "default"
                        : internship.type === "UNPAID"
                          ? "outline"
                          : "secondary"
                    }
                    className="text-sm"
                  >
                    {internship.type}
                  </Badge>
                </div>
              </div>

              {/* Apply CTA */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-medium">Ready to apply?</p>
                    <p className="text-muted-foreground text-sm">
                      Sign in to submit your application
                    </p>
                  </div>
                  <Button size="lg" onClick={() => router.push("/auth/signin")}>
                    Sign in to Apply
                  </Button>
                </CardContent>
              </Card>

              {/* Description */}
              <section>
                <h2 className="mb-4 text-xl font-semibold">About the Role</h2>
                <div className="prose prose-sm text-muted-foreground max-w-none">
                  <p className="whitespace-pre-wrap">
                    {internship.description}
                  </p>
                </div>
              </section>

              <Separator />

              {/* Tasks / Responsibilities */}
              {internship.tasks && internship?.tasks?.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold">
                    What You&apos;ll Do
                  </h2>
                  <ul className="space-y-2">
                    {internship.tasks?.map((task, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex items-start gap-2"
                      >
                        <CheckCircle className="text-primary mt-0.5 h-4 w-4" />
                        <span>{task.title}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <Separator />

              {/* Skills Required */}
              <section>
                <h2 className="mb-4 text-xl font-semibold">
                  Skills & Requirements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Key Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Internship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration
                    </span>
                    <span className="font-medium">
                      {internship.duration} months
                    </span>
                  </div>

                  {internship.type === "PAID" && internship.amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Stipend
                      </span>
                      <span className="font-medium text-green-600">
                        ₹{internship.amount.toLocaleString()}/month
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Deadline
                    </span>
                    <span className="font-medium">
                      {format(new Date(internship.deadline), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Applicants
                    </span>
                    <span className="font-medium">
                      {internship._count.applications}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <Building2 />
                      <AvatarFallback>
                        {internship.organization.organizationName
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {internship.organization.organizationName}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {internship.organization.industry}
                      </p>
                    </div>
                  </div>

                  {internship.organization.website && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        window.open(internship.organization.website!, "_blank")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Internship
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        ) : null}

        {/* Similar Internships */}
        {!isLoading && internship && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Similar Internships</h2>
            <SimilarInternships currentId={internship.id} />
          </section>
        )}
      </div>
    </div>
  );
}

// Skeleton Loader
function InternshipDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

// Similar Internships Component
function SimilarInternships({ currentId }: { currentId: string }) {
  const { data: similar } = api.internships.listPublic.useQuery();

  const filtered = similar?.filter((i) => i.id !== currentId).slice(0, 3);

  if (!filtered || filtered.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {filtered.map((internship) => (
        <Card
          key={internship.id}
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() =>
            (window.location.href = `/internships/${internship.slug}`)
          }
        >
          <CardHeader>
            <CardTitle className="line-clamp-1 text-lg">
              {internship.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {internship.organization.organizationName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {internship.location}
              </span>
              <Badge
                variant={internship.type === "PAID" ? "default" : "outline"}
                className="text-xs"
              >
                {internship.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
