import { z } from "zod";

export const InternshipStatusEnum = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
]);

export const TaskStatusEnum = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
]);

export type InternshipStatus = z.infer<typeof InternshipStatusEnum>;
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

export const internshipProgressSchema = z.object({
  id: z.string().cuid(),
  internId: z.string(),
  internshipId: z.string(),
  progress: z.number().min(0).max(100).default(0),
  status: InternshipStatusEnum.default("IN_PROGRESS"),
  startedAt: z.date().default(() => new Date()),
  completedAt: z.date().nullable().optional(),
});

export type InternshipProgress = z.infer<typeof internshipProgressSchema>;

export const taskProgressSchema = z.object({
  id: z.string().cuid(),
  taskId: z.string(),
  internId: z.string(),
  status: TaskStatusEnum.default("NOT_STARTED"),
  startedAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
});

export type TaskProgress = z.infer<typeof taskProgressSchema>;
