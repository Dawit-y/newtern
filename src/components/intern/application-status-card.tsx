"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, FileText, ArrowLeft } from "lucide-react";
import { type ApplicationStatus } from "@/lib/validation/applications";

interface ApplicationStatusCardProps {
  status: ApplicationStatus;
  internshipSlug: string;
}

export default function ApplicationStatusCard({
  status,
  internshipSlug,
}: ApplicationStatusCardProps) {
  const getBorderColor = () => {
    switch (status) {
      case "ACCEPTED":
        return "border-green-500";
      case "PENDING":
        return "border-yellow-500";
      case "REJECTED":
        return "border-red-500";
      default:
        return "border-gray-400";
    }
  };

  const getBadgeClasses = () => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card
      className={`border-t-4 shadow-sm transition hover:shadow-md ${getBorderColor()}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Application Status
          </CardTitle>
          <Badge
            className={`px-3 py-1 text-sm font-medium ${getBadgeClasses()}`}
          >
            {status}
          </Badge>
        </div>
        <CardDescription>
          You’ve already applied for this internship — here’s your current
          status.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {status === "ACCEPTED" && (
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="mt-0.5 h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Congratulations! 🎉
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your application has been accepted. The organization will
                contact you soon with next steps.
              </p>
            </div>
          </div>
        )}

        {status === "PENDING" && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
            <FileText className="mt-0.5 h-6 w-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Your application is under review
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please be patient while the organization reviews your
                application.
              </p>
            </div>
          </div>
        )}

        {status === "REJECTED" && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <FileText className="mt-0.5 h-6 w-6 text-red-600" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                Application not accepted
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Unfortunately, your application was not selected. Don’t be
                discouraged — keep applying!
              </p>
            </div>
          </div>
        )}

        {status === "WITHDRAWN" && (
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <FileText className="mt-0.5 h-6 w-6 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Application withdrawn
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You’ve withdrawn your application. If this was a mistake, you
                may contact the organization.
              </p>
            </div>
          </div>
        )}

        <Separator />

        <div className="flex justify-between">
          <Link href={`/dashboard/intern/internship/${internshipSlug}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to internship
            </Button>
          </Link>

          {status === "PENDING" && (
            <Button variant="destructive">Withdraw Application</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
