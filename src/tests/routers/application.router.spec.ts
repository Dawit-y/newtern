/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import { createMockDb } from "@/tests/utils/mockDb";
import { createTestCaller } from "@/tests/utils/createCaller";
import {
  mockOrgProfile,
  mockInternships,
  mockApplications,
} from "@/tests/factories/db-mocks";
import { ORG_SESSION, INTERN_SESSION } from "@/tests/factories/sessions";

describe("applicationsRouter", () => {
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    db = createMockDb();
  });

  it("allows ORG user to list applications", async () => {
    mockOrgProfile(db);
    mockInternships(db, 2);
    mockApplications(db, 1);

    const caller = createTestCaller(db, ORG_SESSION);
    const result = await caller.applications.list();

    expect(result).toHaveLength(1);
    expect(db.organizationProfile.findUnique).toHaveBeenCalled();
    expect(db.internship.findMany).toHaveBeenCalled();
    expect(db.application.findMany).toHaveBeenCalled();
  });

  it("rejects unauthorized access", async () => {
    const caller = createTestCaller(db, INTERN_SESSION);
    await expect(caller.applications.list()).rejects.toThrow(
      /Only organizations/i,
    );
  });
});
