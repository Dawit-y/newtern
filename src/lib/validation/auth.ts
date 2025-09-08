import { z } from "zod";

const baseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.enum(["INTERN", "ORGANIZATION"]),
});

// Intern schema
export const internSchema = baseSchema.extend({
  role: z.literal("INTERN"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  university: z.string().min(1),
  major: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
});

// Organization schema
export const organizationSchema = baseSchema.extend({
  role: z.literal("ORGANIZATION"),
  organizationName: z.string().min(1),
  contactFirstName: z.string().min(1),
  contactLastName: z.string().min(1),
  jobTitle: z.string().min(1),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  website: z.string().url().optional(),
  location: z.string().min(1),
  description: z.string().min(1),
  internshipGoals: z.string().optional(),
});

// Combined
export const registerSchema = z.union([internSchema, organizationSchema]);

export type OrgFormValues = z.infer<typeof organizationSchema>;
export type InternFormValues = z.infer<typeof internSchema>;