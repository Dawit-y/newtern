import { z } from "zod";

export const applicationStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);
export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;

export const applicationSchema = z.object({
  internId: z.string().min(1, "Intern ID is required"),
  internshipId: z.string().min(1, "Internship ID is required"),
  coverLetter: z.string().nullable().optional(),
  resume: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  status: applicationStatusEnum,
});

export type Application = z.infer<typeof applicationSchema>;
