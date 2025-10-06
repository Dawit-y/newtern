import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getOrgProfileOrThrow,
  getInternProfileOrThrow,
} from "@/server/lib/helpers/org";

export const profilesRouter = createTRPCRouter({
  getCurrentProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userRole = ctx.session.user.role;

    try {
      if (userRole === "ORGANIZATION") {
        const orgProfile = await getOrgProfileOrThrow(ctx.db, userId);
        return {
          type: "organization" as const,
          ...orgProfile,
        };
      } else if (userRole === "INTERN") {
        const internProfile = await getInternProfileOrThrow(ctx.db, userId);
        return {
          type: "intern" as const,
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
});
