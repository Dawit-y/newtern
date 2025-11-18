"use client";

import { useRouter } from "next/navigation";
import { Building2, CheckCircle, Star, Download } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type RouterOutputs } from "@/trpc/react";

type Internship = RouterOutputs["internships"]["myInternships"][number];

export default function MyInternshipCard({
  internship,
}: {
  internship: Internship;
}) {
  const router = useRouter();
  const progress = internship.internshipProgress;
  const isCompleted = progress?.status === "COMPLETED";
  const appStatus = internship.application?.status;

  return (
    <Card
      className={`relative flex h-full flex-col ${isCompleted ? "border-green-200 bg-green-50/50" : ""}`}
    >
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-xl">
              {internship.title}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-sm">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">
                {internship.organization.organizationName}
              </span>
            </CardDescription>
          </div>
          {appStatus === "PENDING" && (
            <Badge variant="outline" className="text-xs">
              Application Pending
            </Badge>
          )}
          {appStatus === "ACCEPTED" && (
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className="ml-2 flex-shrink-0"
            >
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-6">
        {/* Progress Section - Always in the same position */}
        <div className="flex-shrink-0">
          <div className="mb-1 flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {progress?.progress ?? 0}/{internship._count.tasks} tasks
            </span>
          </div>
          <Progress value={(progress?.progress ?? 0) * 10} />
        </div>

        {isCompleted && (
          <div className="absolute top-1/2 right-4 left-4 -translate-y-1/2 transform">
            <Alert className="border-green-200 bg-green-50 shadow-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Internship Completed!
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-1 h-3.5 w-3.5" /> Certificate
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        <div className="flex flex-shrink-0 gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              router.push(`/dashboard/intern/internship/${internship.slug}`)
            }
          >
            View Details
          </Button>

          {(() => {
            return (
              !isCompleted &&
              appStatus !== "PENDING" && (
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/intern/internship/${internship.slug}`,
                    )
                  }
                >
                  Continue
                </Button>
              )
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}
