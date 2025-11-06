import { z } from "zod";

// Schema for form validation (includes File for resume)
export const internProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  university: z.string().min(1, "University is required"),
  major: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  linkedin: z.string().url().optional().or(z.literal("")).nullable(),
  github: z.string().url().optional().or(z.literal("")).nullable(),
  portfolio: z.string().url().optional().or(z.literal("")).nullable(),
  location: z.string().optional().nullable(),
  graduationYear: z.string().optional().nullable(),
  gpa: z.coerce.number().optional().nullable(),
  experience: z.string().optional().nullable(),
  resume: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) =>
        !file ||
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Invalid file type",
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File too large (max 5MB)",
    ),
});

// Schema for tRPC (resume is string path, not File)
export const internProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  university: z.string().min(1, "University is required"),
  major: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  linkedin: z.string().url().optional().or(z.literal("")).nullable(),
  github: z.string().url().optional().or(z.literal("")).nullable(),
  portfolio: z.string().url().optional().or(z.literal("")).nullable(),
  location: z.string().optional().nullable(),
  graduationYear: z.string().optional().nullable(),
  gpa: z.coerce.number().optional().nullable(),
  experience: z.string().optional().nullable(),
  resume: z.string().optional().nullable(),
  image: z.string().optional(),
});

export type InternProfileInput = z.infer<typeof internProfileFormSchema>;
export type InternProfileUpdateInput = z.infer<typeof internProfileSchema>;
