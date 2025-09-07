import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/validation/auth";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, role } = input;

      // check if user exists
      const existingUser = await ctx.db.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create base user
      const user = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      // role-specific profile creation
      if (role === "INTERN") {
        const intern = await ctx.db.internProfile.create({
          data: {
            userId: user.id,
            firstName: input.firstName,
            lastName: input.lastName,
            university: input.university,
            major: input.major,
            skills: input.skills,
            bio: input.bio,
          },
        });
      } else if (role === "ORGANIZATION") {
        const org = await ctx.db.organizationProfile.create({
          data: {
            userId: user.id,
            organizationName: input.organizationName,
            contactFirstName: input.contactFirstName,
            contactLastName: input.contactLastName,
            jobTitle: input.jobTitle,
            industry: input.industry,
            companySize: input.companySize,
            website: input.website,
            location: input.location,
            description: input.description,
            internshipGoals: input.internshipGoals,
          },
        });
      }

      return { id: user.id, email: user.email, role: user.role };
    }),
});
