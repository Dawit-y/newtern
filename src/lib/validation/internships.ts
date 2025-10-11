import { z } from "zod";

export const internshipTypeEnum = z.enum(["PAID", "UNPAID", "STIPEND"]);

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

export type InternshipType = z.infer<typeof internshipSchema>;
export type InternshipPaymentType = z.infer<typeof internshipTypeEnum>;
