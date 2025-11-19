import type { InternProfile } from "@prisma/client";
import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export function getInternFullName(
  intern: Pick<InternProfile, "firstName" | "lastName">,
): string {
  return `${intern.firstName} ${intern.lastName}`.trim();
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