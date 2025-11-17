import type { PrismaClient } from "@prisma/client";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

export type MockDb = DeepMockProxy<PrismaClient>;

export const createMockDb = (): MockDb => {
  return mockDeep<PrismaClient>();
};
