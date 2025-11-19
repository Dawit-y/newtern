"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Calendar,
  Clock,
  // DollarSign,
  ExternalLink,
  MapPin,
  Send,
  Target,
  Users,
} from "lucide-react";
import type { RouterOutputs } from "@/trpc/react";
import { usePathname } from "next/navigation";

type Internship = RouterOutputs["internships"]["bySlug"];

interface Props {
  internship: Internship;
}

export default function InternshipHeader({ internship }: Props) {
  const pathname = usePathname();
  const canApply =
    !pathname.endsWith("/apply") && internship?.userApplication === null;
  const isAccepted = internship?.userApplication?.status === "ACCEPTED";
  const isPending = internship?.userApplication?.status === "PENDING";
  const isRejected = internship?.userApplication?.status === "REJECTED";

  const getStatusBadge = () => {
    switch (internship?.userApplication?.status) {
      case "ACCEPTED":
        return <Badge variant="default">Accepted</Badge>;
      case "PENDING":
        return <Badge variant="outline">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-background rounded-lg border">
      <CardContent className="px-4 py-8 md:px-6">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Company Logo */}
          <Avatar className="h-20 w-20 rounded-lg">
            <AvatarImage src={"/placeholder.svg"} />
            <AvatarFallback>
              <Building2 className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>

          {/* Internship Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{internship.title}</h1>
                {internship.type && (
                  <Badge variant="default">{internship.type}</Badge>
                )}
                {getStatusBadge()}
              </div>
              <p className="text-muted-foreground text-lg">
                {internship.organization.organizationName}
              </p>
            </div>

            {/* Internship Meta */}
            <div className="flex flex-wrap gap-6 text-sm">
              {internship.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{internship.location}</span>
                </div>
              )}
              {internship.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span>{internship.duration}</span>
                </div>
              )}
              {internship.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Apply by: {internship.deadline.toISOString()}</span>
                </div>
              )}
              {/* {internship.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <span>{internship.salary}</span>
                </div>
              )} */}
              {internship._count.applications !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span>{internship._count.applications} applicants</span>
                </div>
              )}

              {/* Accepted Internship Data */}
              {isAccepted && internship.tasks && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    {/* <span>
                      {internship.workspaceData.startDate} -{" "}
                      {internship.workspaceData.endDate}
                    </span> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="text-muted-foreground h-4 w-4" />
                    <span>
                      {(internship?.progress?.progress ??
                        0 * internship._count.tasks) / 100}{" "}
                      of {internship._count.tasks} tasks completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={"/placeholder.svg"} />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <span>
                      Mentor: {internship.organization.user.name} (
                      {internship.organization.jobTitle})
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Skills */}
            {internship.skills && internship.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            {/* Progress */}
            {isAccepted && internship.progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">
                    {internship.progress.progress}%
                  </span>
                </div>
                <Progress
                  value={internship.progress.progress}
                  className="h-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isAccepted && (
          <div className="mt-6 flex gap-3 border-t pt-6">
            {canApply && (
              <Button size="lg" asChild>
                <Link
                  href={`/dashboard/intern/internship/${internship.slug}/apply`}
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
            {isRejected && (
              <Button size="lg" variant="destructive" disabled>
                <Building2 className="mr-2 h-4 w-4" />
                Application Rejected
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link
                href={`/company/${internship.organization.organizationName.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Company Profile
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
