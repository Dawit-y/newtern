import { z } from "zod";

export const internshipTypeEnum = z.enum(["PAID", "UNPAID", "STIPEND"]);
export const resourceTypeEnum = z.enum(["FILE", "URL"]);

export const internshipSchema = z.object({
  id: z.string().cuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  type: internshipTypeEnum,
  location: z.string(),
  requirements: z.string().nullable().optional(),
  deadline: z.date(),
  skills: z.array(z.string()),
  published: z.boolean().default(false),
  approved: z.boolean().default(false),

  organizationId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const taskSchema = z.object({
  id: z.string().cuid(),
  slug: z.string(),
  title: z.string(),
  overview: z.string(),
  background: z.string().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  description: z.string(),
  instructions: z.string(),
  submissionInstructions: z.string(),
  submitAsFile: z.boolean().default(false),
  submitAsText: z.boolean().default(false),
  submitAsUrl: z.boolean().default(false),

  internshipId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const resourceSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  url: z.string().url().nullable().optional(),
  file: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  type: resourceTypeEnum,

  taskId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type InternshipType = z.infer<typeof internshipSchema>;
export type TaskType = z.infer<typeof taskSchema>;
export type ResourceType = z.infer<typeof resourceSchema>;
