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

  return (
    <Card className={isCompleted ? "border-green-200 bg-green-50/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{internship.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Building2 className="h-3.5 w-3.5" />
              {internship.organization.organizationName}
            </CardDescription>
          </div>
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {progress?.progress ?? 0}/{internship._count.tasks} tasks
            </span>
          </div>
          <Progress value={(progress?.progress ?? 0) * 10} />
        </div>

        {isCompleted && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="flex items-center justify-between">
              <span className="font-medium">Internship Completed!</span>
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
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              router.push(`/dashboard/intern/internship/${internship.slug}`)
            }
          >
            View Details
          </Button>
          {!isCompleted && (
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/intern/internship/${internship.slug}/tasks`,
                )
              }
            >
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
