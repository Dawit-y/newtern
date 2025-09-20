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
 * Ensure an organization owns the internship
 */
export async function assertOrgOwnsInternship(
  ctx: ProtectedContext,
  internship: { organizationId: string },
) {

  const orgProfile = await getOrgProfileOrThrow(ctx.db, ctx.session.user.id);
  if (internship.organizationId !== orgProfile.id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
  }
}
