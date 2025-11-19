import { z } from "zod";

export const taskEvaluationSchema = z.object({
  taskSubmissionId: z.string().min(1, "Task Submission ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
  score: z.number().min(0).max(100, "Score must be between 0 and 100"),
  feedback: z.string().nullable().optional(),
});

export type TaskEvaluation = z.infer<typeof taskEvaluationSchema>;
