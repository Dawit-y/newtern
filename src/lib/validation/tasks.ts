import { z } from "zod";
import { resourceSchema } from "@/lib/validation/resources";

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

export type TaskType = z.infer<typeof taskSchema>;

