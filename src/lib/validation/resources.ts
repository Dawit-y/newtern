import { z } from "zod";

export const resourceTypeEnum = z.enum(["FILE", "URL"]);


export const resourceSchema = z.object({
  name: z.string(),
  url: z.string().url().nullable().optional(),
  file: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  type: resourceTypeEnum,
  taskId: z.string(),
});

export type ResourceType = z.infer<typeof resourceSchema>;
