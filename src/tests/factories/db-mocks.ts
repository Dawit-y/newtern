import { type createMockDb } from "@/tests/utils/mockDb";
import { ApplicationStatus, InternshipType } from "@prisma/client";


export const mockOrgProfile = (
  db: ReturnType<typeof createMockDb>,
  overrides = {},
) => {
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
    ...overrides,
  });
};

export const mockInternships = (
  db: ReturnType<typeof createMockDb>,
  count = 1,
  overrides = {},
) => {
  const items = Array.from({ length: count }, (_, i) => ({
    id: `intern${i + 1}`,
    slug: `internship-${i + 1}`,
    title: "Software Engineer Intern",
    description: "Work on cool software projects.",
    duration: "3 months",
    type: InternshipType.PAID,
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
    ...overrides,
  }));

  db.internship.findMany.mockResolvedValue(items);

  return items;
};

export const mockApplications = (
  db: ReturnType<typeof createMockDb>,
  count = 1,
  overrides = {},
) => {
  const items = Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    status: ApplicationStatus.PENDING,
    internId: "int1",
    internshipId: "intern1",
    availability: "Full-time",
    resume: "http://example.com/resume.pdf",
    coverLetter: "I am very interested in this position.",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }));

  db.application.findMany.mockResolvedValue(items);

  return items;
};
