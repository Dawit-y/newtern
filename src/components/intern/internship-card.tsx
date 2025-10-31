"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Building2, MapPin, ExternalLink } from "lucide-react";

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
import { type RouterOutputs } from "@/trpc/react";

type Internship = RouterOutputs["internships"]["listPublic"][number];

export default function InternshipCard({ internship }: { internship: Internship }) {
  const router = useRouter();
  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="group-hover:text-primary text-xl transition-colors">
              {internship.title}
            </CardTitle>
            <CardDescription className="mt-1 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {internship.organization.organizationName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {internship.location}
              </span>
            </CardDescription>
          </div>
          <Badge variant={internship.type === "PAID" ? "default" : "outline"}>
            {internship.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground line-clamp-2">
          {internship.description}
        </p>
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
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{internship._count.tasks} tasks</span>
          <span>
            Deadline: {format(new Date(internship.deadline), "MMM d")}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() =>
              router.push(
                `/dashboard/intern/internship/${internship.slug}/apply`,
              )
            }
          >
            Apply Now
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
      </CardContent>
    </Card>
  );
}
