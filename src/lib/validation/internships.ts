import { z } from "zod";

export const internshipTypeEnum = z.enum(["PAID", "UNPAID", "STIPEND"]);
export const resourceTypeEnum = z.enum(["FILE", "URL"]);

export const internshipSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  type: internshipTypeEnum.refine((val) => !!val, {
    message: "Type is required",
  }),
  location: z.string().min(1, "Location is required"),
  requirements: z.string().min(1, "Requirements is required"),
  deadline: z.coerce.date().min(new Date(), "Deadline must be in the future"),
  skills: z.array(z.string()),
  published: z.boolean().default(false).optional(),
  approved: z.boolean().default(false).optional(),
  organizationId: z.string(),
});

export const resourceSchema = z.object({
  name: z.string(),
  url: z.string().url().nullable().optional(),
  file: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  type: resourceTypeEnum,
  taskId: z.string(),
});

// Base task schema without validation refinement
export const taskBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  overview: z.string().min(1, "Overview is required"),
  background: z.string().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().min(1, "Instructions are required"),
  submissionInstructions: z.string(),
  submitAsFile: z.boolean(),
  submitAsText: z.boolean(),
  submitAsUrl: z.boolean(),
  internshipId: z.string(),
  resources: z.array(resourceSchema.omit({ taskId: true })).optional(),
});

// Full task schema with refinement for creation
export const taskSchema = taskBaseSchema.refine(
  (data) => data.submitAsFile || data.submitAsText || data.submitAsUrl,
  {
    message: "At least one submission type is required",
    path: ["submitAsFile"],
  },
);

export type InternshipType = z.infer<typeof internshipSchema>;
export type TaskType = z.infer<typeof taskSchema>;
export type ResourceType = z.infer<typeof resourceSchema>;
export type InternshipPaymentType = z.infer<typeof internshipTypeEnum>;
