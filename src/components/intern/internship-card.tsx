"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Building2, MapPin, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { type RouterOutputs } from "@/trpc/react";

type Internship =
  RouterOutputs["internships"]["listForIntern"]["items"][number];

export default function InternshipCard({
  internship,
}: {
  internship: Internship;
}) {
  const router = useRouter();
  const application = internship.applications;

  const getButtonState = () => {
    if (!application) {
      return {
        label: "Apply Now",
        variant: "default" as const,
        disabled: false,
        onClick: () =>
          router.push(`/dashboard/intern/internship/${internship.slug}/apply`),
      };
    }

    switch (application.status) {
      case "PENDING":
        return {
          label: "Application Pending",
          variant: "secondary" as const,
          disabled: true,
        };
      case "ACCEPTED":
        return {
          label: "Accepted 🎉",
          variant: "secondary" as const,
          disabled: true,
        };
      case "REJECTED":
        return {
          label: "Rejected",
          variant: "destructive" as const,
          disabled: true,
        };
      case "WITHDRAWN":
        return {
          label: "Withdrawn",
          variant: "outline" as const,
          disabled: true,
        };
      default:
        return {
          label: "Apply Now",
          variant: "default" as const,
          disabled: false,
          onClick: () =>
            router.push(
              `/dashboard/intern/internship/${internship.slug}/apply`,
            ),
        };
    }
  };

  const buttonState = getButtonState();

  return (
    <Card className="group flex h-full flex-col transition-all hover:shadow-lg">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="group-hover:text-primary line-clamp-2 text-xl transition-colors">
              {internship.title}
            </CardTitle>
            <CardDescription className="mt-1 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1 truncate">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {internship.organization.organizationName}
                </span>
              </span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{internship.location}</span>
              </span>
            </CardDescription>
          </div>
          <Badge
            variant={internship.type === "PAID" ? "default" : "outline"}
            className="ml-2 flex-shrink-0"
          >
            {internship.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {/* Description */}
        <p className="text-muted-foreground line-clamp-3 flex-shrink-0">
          {internship.description}
        </p>

        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5">
            {internship.skills.slice(0, 3).map((s: string) => (
              <Badge key={s} variant="secondary" className="text-xs">
                {s}
              </Badge>
            ))}
            {internship.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{internship.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 space-y-3">
          {/* Stats */}
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>{internship._count.tasks} tasks</span>
            <span>
              Deadline: {format(new Date(internship.deadline), "MMM d")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={buttonState.variant}
              disabled={buttonState.disabled}
              onClick={buttonState.onClick}
            >
              {buttonState.label}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                router.push(`/dashboard/intern/internship/${internship.slug}`)
              }
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
