"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

interface ReviewStepProps {
  internshipId: string | null;
}

export default function ReviewStep({ internshipId }: ReviewStepProps) {
  const { data: internshipData } = api.internships.byId.useQuery(
    internshipId ?? "",
    { enabled: !!internshipId },
  );

  const { data: tasks = [] } = api.tasks.list.useQuery(
    { internshipId: internshipId! },
    { enabled: !!internshipId },
  );
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review & Publish</h3>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Internship Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-muted-foreground text-sm">
                  {internshipData?.title ?? "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-muted-foreground text-sm">
                  {internshipData?.duration ?? "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-muted-foreground text-sm">
                  {internshipData?.type ?? "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-muted-foreground text-sm">
                  {internshipData?.location ?? "Not specified"}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-muted-foreground text-sm">
                {internshipData?.description ?? "Not specified"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Requirements</Label>
              <p className="text-muted-foreground text-sm">
                {internshipData?.requirements ?? "Not specified"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Deadline</Label>
              <p className="text-muted-foreground text-sm">
                {internshipData?.deadline
                  ? new Date(internshipData.deadline).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks created</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded border p-2"
                  >
                    <span className="text-sm font-medium">{index + 1}.</span>
                    <span className="text-sm">{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
