import { TRPCError } from "@trpc/server";
import type { ProtectedContext } from "@/server/api/trpc";
import { getOrgProfileOrThrow } from "./org";

/**
 * Ensure the user is not an INTERN
 */
export function assertNotIntern(ctx: ProtectedContext) {
  if (ctx.session.user.role === "INTERN") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
  }
}

/**
 * Ensure the user is an ORGANIZATION
 */
export function assertOrganization(ctx: ProtectedContext) {
  if (ctx.session.user.role !== "ORGANIZATION") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Only organizations can perform this action",
    });
  }
}
/**
 * Ensure the user is an ADMIN
 */
export function assertAdmin(ctx: ProtectedContext) {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Only admins can perform this action",
    });
  }
}

/**
 * Ensure an organization owns the internship
 */
export async function assertOrgOwnsInternship(
  ctx: ProtectedContext,
  internship: { organizationId?: string; internshipId?: string },
) {
  const orgProfile = await getOrgProfileOrThrow(ctx.db, ctx.session.user.id);

  if (internship.organizationId) {
    if (internship.organizationId !== orgProfile.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
    }
  } else if (internship.internshipId) {
    const internshipRecord = await ctx.db.internship.findUnique({
      where: { id: internship.internshipId },
      select: { organizationId: true },
    });
    if (!internshipRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Internship not found",
      });
    }
    if (internshipRecord.organizationId !== orgProfile.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
    }
  } else {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Must provide either internshipId or organizationId",
    });
  }
}
