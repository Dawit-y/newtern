import { appRouter } from "@/server/api/root";
import type { Session } from "@/lib/auth-client";
import type { PrismaClient } from "@prisma/client";
import type { DeepMockProxy } from "vitest-mock-extended";

export const createTestCaller = (
  db: DeepMockProxy<PrismaClient>,
  session: Session | null,
) => {
  return appRouter.createCaller({
    db,
    session,
    headers: new Headers(),
  });
};
