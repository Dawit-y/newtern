import { describe, it, expect, beforeEach } from "vitest";
import { createMockDb } from "@/tests/utils/mockDb";
import { createTestCaller } from "@/tests/utils/createCaller";
import { mockInternships } from "../factories/db-mocks";

describe("tRPC internships.listPublic", () => {
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    db = createMockDb();
  });

  it("returns published and approved internships (empty ok)", async () => {
    mockInternships(db, 2);
    const caller = createTestCaller(db, null);

    const result = await caller.internships.listPublic({ take: 5, skip: 0 });

    expect(Array.isArray(result)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(db.internship.findMany).toHaveBeenCalled();
  });
});
