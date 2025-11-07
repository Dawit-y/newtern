import { describe, it, expect, vi } from "vitest";

// Mock the db module BEFORE importing anything that uses it
vi.mock("@/server/db", () => ({
  db: {
    internship: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

// Import after the mock is registered
import { appRouter } from "@/server/api/root";
import { type PrismaClient } from "@prisma/client";

describe("tRPC internships.listPublic", () => {
  it("returns published and approved internships (empty ok)", async () => {
    // You can still access the mock here
    const { db } = await import("@/server/db");

    const caller = appRouter.createCaller({
      db: db as unknown as PrismaClient,
      session: null,
      headers: new Headers(),
    });

    const result = await caller.internships.listPublic({ take: 5, skip: 0 });

    expect(Array.isArray(result)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(db.internship.findMany).toHaveBeenCalled();
  });
});
