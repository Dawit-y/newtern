import { z } from "zod";

export const submissionStatusEnum = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "NEEDS_REVISION",
  "ACCEPTED",
  "REJECTED",
]);
export type SubmissionStatus = z.infer<typeof submissionStatusEnum>;

export const taskSubmissionSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  internId: z.string().min(1, "Intern ID is required"),
  textContent: z.string().nullable().optional(),
  fileUrl: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  status: submissionStatusEnum.default("SUBMITTED"),
});

export type TaskSubmission = z.infer<typeof taskSubmissionSchema>;
