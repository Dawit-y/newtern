import type { InternProfile } from "@prisma/client";

export function getInternFullName(
  intern: Pick<InternProfile, "firstName" | "lastName">,
): string {
  return `${intern.firstName} ${intern.lastName}`.trim();
}
