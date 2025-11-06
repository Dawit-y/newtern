import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getOrgProfileOrThrow,
  getInternProfileOrThrow,
} from "@/server/lib/helpers/org";
import { assertIntern } from "@/server/lib/helpers/auth";
import { TRPCError } from "@trpc/server";
import { internProfileSchema } from "@/lib/validation/profile";

export const profilesRouter = createTRPCRouter({
  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userRole = ctx.session.user.role;

    const user = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        name: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    try {
      if (userRole === "ORGANIZATION") {
        const orgProfile = await getOrgProfileOrThrow(ctx.db, userId);
        return {
          type: "organization" as const,
          user: {
            ...user,
          },
          ...orgProfile,
        };
      } else if (userRole === "INTERN") {
        const internProfile = await getInternProfileOrThrow(ctx.db, userId);
        return {
          type: "intern" as const,
          user: {
            ...user,
          },
          ...internProfile,
        };
      }

      throw new Error("Invalid user role");
    } catch (error) {
      console.error("Failed to get profile:", error);
      return null;
    }
  }),

  getOrganizationId: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ORGANIZATION") {
      throw new Error("User is not an organization");
    }

    const orgProfile = await getOrgProfileOrThrow(ctx.db, ctx.session.user.id);
    return orgProfile.id;
  }),

  getInternId: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "INTERN") {
      throw new Error("User is not an intern");
    }

    const internProfile = await getInternProfileOrThrow(
      ctx.db,
      ctx.session.user.id,
    );
    return internProfile.id;
  }),
  updateInternProfile: protectedProcedure
    .input(internProfileSchema)
    .mutation(async ({ ctx, input }) => {
      assertIntern(ctx);
      const profile = await ctx.db.internProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Intern profile not found",
        });
      }

      const updated = await ctx.db.internProfile.update({
        where: { id: profile.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          university: input.university,
          major: input.major ?? null,
          skills: input.skills ?? null,
          bio: input.bio ?? null,
          phone: input.phone ?? null,
          linkedin: input.linkedin ?? null,
          github: input.github ?? null,
          portfolio: input.portfolio ?? null,
          location: input.location ?? null,
          graduationYear: input.graduationYear ?? null,
          gpa: input.gpa ?? null,
          experience: input.experience ?? null,
          resume: input.resume ?? profile.resume,
        },
      });

      // Update user avatar if provided
      const imagePath = (input as { image?: string | null }).image ?? null;
      if (typeof imagePath === "string" && imagePath.length > 0) {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { image: imagePath },
        });
      }

      return updated;
    }),
});
