import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { registerSchema } from "@/lib/validation/auth";
import { auth } from "@/lib/auth";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, role } = input;
      let name: string;
      if (role === "INTERN") {
        name = `${input.firstName} ${input.lastName}`;
      } else {
        name = `${input.contactFirstName} ${input.contactLastName}`;
      }

      const result = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });
      if (!result?.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register user",
        });
      }

      const userId = result.user.id;

      const user = await ctx.db.user.update({
        where: { id: userId },
        data: {
          name,
          role,
        },
      });

      if (role === "INTERN") {
        await ctx.db.internProfile.create({
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
        await ctx.db.organizationProfile.create({
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

      return user;
    }),
});
