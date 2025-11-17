/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import { createMockDb } from "@/tests/utils/mockDb";
import { createTestCaller } from "@/tests/utils/createCaller";

describe("applicationsRouter", () => {
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    db = createMockDb();
  });

  const orgSession = {
    session: {
      id: "s1",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "org123",
      expiresAt: new Date(),
      token: "token",
    },
    user: {
      id: "org123",
      role: "ORGANIZATION",
      name: "org",
      email: "org@gmail.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  it("allows ORG user to list applications", async () => {
    // organization lookup
    db.organizationProfile.findUnique.mockResolvedValue({
      id: "org123",
      organizationName: "Test Org",
      userId: "org123",
      internshipGoals: "Provide great internships",
      companySize: "51-200",
      contactFirstName: "Org",
      contactLastName: "User",
      description: "We are a test organization.",
      industry: "Technology",
      jobTitle: "HR Manager",
      location: "123 Test St, Test City",
      website: "http://testorg.com",
    });

    // 🔥 Required mock for internship IDs
    db.internship.findMany.mockResolvedValue([
      {
        id: "intern1",
        slug: "internship-1",
        title: "Software Engineer Intern",
        description: "Work on cool software projects.",
        duration: "3 months",
        type: "PAID",
        amount: 3000,
        rating: null,
        feedback: null,
        location: "Remote",
        requirements: "Knowledge of TypeScript",
        deadline: new Date(),
        skills: ["TypeScript", "Node.js"],
        published: true,
        approved: true,
        organizationId: "org123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "intern2",
        slug: "internship-2",
        title: "Software Engineer Intern",
        description: "Work on cool software projects.",
        duration: "3 months",
        type: "PAID",
        amount: 3000,
        rating: null,
        feedback: null,
        location: "Remote",
        requirements: "Knowledge of TypeScript",
        deadline: new Date(),
        skills: ["TypeScript", "Node.js"],
        published: true,
        approved: true,
        organizationId: "org123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // applications mock
    db.application.findMany.mockResolvedValue([
      {
        id: "1",
        status: "PENDING",
        internId: "int1",
        internshipId: "intern1",
        availability: "Full-time",
        resume: "http://example.com/resume.pdf",
        coverLetter: "I am very interested in this position.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const caller = createTestCaller(db, orgSession);

    const result = await caller.applications.list();

    expect(result).toHaveLength(1);
    expect(db.organizationProfile.findUnique).toHaveBeenCalled();
    expect(db.internship.findMany).toHaveBeenCalled(); // 🔥 make sure it's called
    expect(db.application.findMany).toHaveBeenCalled();
  });

  it("rejects unauthorized access", async () => {
    const internSession = {
      session: {
        id: "s2",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "u10",
        expiresAt: new Date(),
        token: "token",
      },
      user: {
        id: "u10",
        role: "INTERN",
        name: "int",
        email: "int@gmail.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const caller = createTestCaller(db, internSession);

    await expect(caller.applications.list()).rejects.toThrow(
      /Only organizations/i,
    );
  });
});
