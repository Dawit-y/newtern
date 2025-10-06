import { TRPCError } from "@trpc/server";
import { type PrismaClient } from "@prisma/client";

export async function getOrgProfileOrThrow(db: PrismaClient, userId: string) {
  const orgProfile = await db.organizationProfile.findUnique({
    where: { userId },
  });

  if (!orgProfile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization profile not found",
    });
  }

  return orgProfile;
}

export async function getInternProfileOrThrow(
  db: PrismaClient,
  userId: string,
) {
  const internProfile = await db.internProfile.findUnique({
    where: { userId },
  });

  if (!internProfile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Intern profile not found",
    });
  }

  return internProfile;
}
