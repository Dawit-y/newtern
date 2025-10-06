"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskCreationWizard from "@/components/organization/task-creation-wizard";
import { FileText, Plus, X } from "lucide-react";
import { api } from "@/trpc/react";

interface TasksStepProps {
  internshipId: string | null;
}

export default function TasksStep({ internshipId }: TasksStepProps) {
  const [showTaskWizard, setShowTaskWizard] = useState(false);

  const { data: tasks = [], isLoading } = api.tasks.list.useQuery(
    { internshipId: internshipId! },
    { enabled: !!internshipId },
  );

  const onShowTaskWizard = () => setShowTaskWizard(true);

  const utils = api.useUtils();
  const deleteTask = api.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate({ internshipId: internshipId! });
    },
  });

  const onRemoveTask = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  return (
    <>
      {/* Task Creation Wizard Modal */}
      {showTaskWizard && (
        <TaskCreationWizard
          internshipId={internshipId}
          onClose={() => setShowTaskWizard(false)}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Tasks</h3>
            <p className="text-muted-foreground">
              Create tasks that interns will complete during this internship
            </p>
          </div>
          <Button
            onClick={onShowTaskWizard}
            className="flex items-center gap-2"
            disabled={!internshipId}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Empty state when internshipId not available */}
        {!internshipId ? (
          <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed py-12 text-center">
            <FileText className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <h4 className="mb-2 text-lg font-medium">
              Complete Basic Information First
            </h4>
            <p className="text-muted-foreground mb-4">
              Please complete the basic information section before adding tasks
            </p>
          </div>
        ) : isLoading ? (
          <p className="text-muted-foreground">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed py-12 text-center">
            <FileText className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <h4 className="mb-2 text-lg font-medium">No tasks created yet</h4>
            <p className="text-muted-foreground mb-4">
              Start by creating your first task for this internship
            </p>
            <Button onClick={onShowTaskWizard}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <Card key={task.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {task.title}
                        </CardTitle>
                        <CardDescription>{task.overview}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-muted-foreground text-sm">
                    {task.description.substring(0, 150)}...
                  </div>
                  {task.resources && task.resources.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        Resources:
                      </span>
                      {task.resources.map((resource, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {resource.type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
