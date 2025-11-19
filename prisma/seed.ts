import {
  PrismaClient,
  Role,
  InternshipType,
  ApplicationStatus,
  InternshipStatus,
  TaskStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Realistic data arrays
const ORGANIZATIONS = [
  {
    email: "hr@techinnovate.com",
    name: "Sarah Johnson",
    organizationName: "TechInnovate Solutions",
    contactFirstName: "Sarah",
    contactLastName: "Johnson",
    jobTitle: "HR Manager",
    industry: "Technology",
    companySize: "51-200",
    website: "https://techinnovate.com",
    location: "San Francisco, CA",
    description:
      "Leading provider of AI-driven business solutions focused on helping enterprises optimize their operations through cutting-edge technology.",
    internshipGoals:
      "Provide hands-on experience in software development and expose interns to real-world projects in AI and machine learning.",
  },
  {
    email: "careers@greenfuture.org",
    name: "Michael Chen",
    organizationName: "GreenFuture Initiatives",
    contactFirstName: "Michael",
    contactLastName: "Chen",
    jobTitle: "Program Director",
    industry: "Environmental Services",
    companySize: "11-50",
    website: "https://greenfuture.org",
    location: "Portland, OR",
    description:
      "Non-profit organization dedicated to promoting sustainable practices and environmental conservation through community programs.",
    internshipGoals:
      "Develop future environmental leaders and provide practical experience in sustainability projects and community outreach.",
  },
];

const INTERNS = [
  {
    email: "emma.wilson@university.edu",
    name: "Emma Wilson",
    firstName: "Emma",
    lastName: "Wilson",
    university: "Stanford University",
    major: "Computer Science",
    skills: "JavaScript, Python, React, Node.js",
    bio: "Passionate about full-stack development and AI. Looking to apply academic knowledge in real-world projects.",
  },
  {
    email: "alex.rodriguez@statecollege.edu",
    name: "Alex Rodriguez",
    firstName: "Alex",
    lastName: "Rodriguez",
    university: "State College",
    major: "Environmental Science",
    skills: "Data Analysis, GIS, Research, Sustainability",
    bio: "Environmental science student with focus on sustainable development and conservation efforts.",
  },
  {
    email: "jasmine.patel@techuniversity.edu",
    name: "Jasmine Patel",
    firstName: "Jasmine",
    lastName: "Patel",
    university: "Tech University",
    major: "Business Administration",
    skills: "Marketing, Analytics, Project Management, SEO",
    bio: "Business student specializing in digital marketing and analytics. Interested in tech startup environments.",
  },
  {
    email: "david.kim@engineering.edu",
    name: "David Kim",
    firstName: "David",
    lastName: "Kim",
    university: "Engineering Institute",
    major: "Mechanical Engineering",
    skills: "CAD, MATLAB, Prototyping, 3D Modeling",
    bio: "Engineering student passionate about product design and development. Experience in automotive projects.",
  },
  {
    email: "sophia.martinez@designschool.edu",
    name: "Sophia Martinez",
    firstName: "Sophia",
    lastName: "Martinez",
    university: "Design School",
    major: "Graphic Design",
    skills: "UI/UX Design, Figma, Adobe Creative Suite, Branding",
    bio: "Creative designer focused on user-centered design principles and creating engaging digital experiences.",
  },
];

const INTERNSHIPS = [
  {
    slug: "software-development-intern",
    title: "Software Development Intern",
    description:
      "Join our engineering team to work on real-world projects using modern technologies. You'll participate in agile development processes, contribute to code reviews, and help build scalable applications.",
    duration: "3 months",
    type: InternshipType.PAID,
    amount: 4500, // Monthly stipend
    location: "San Francisco, CA",
    requirements:
      "Currently pursuing Computer Science degree, knowledge of JavaScript/Python, familiarity with Git",
    deadline: new Date("2024-08-15"),
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    published: true,
    approved: true,
    tasks: [
      {
        slug: "api-integration-task",
        title: "REST API Integration",
        overview: "Integrate third-party API into existing application",
        description:
          "Research, implement and test integration with a third-party REST API. Document the integration process and create unit tests.",
        instructions:
          "Choose a suitable third-party API, implement authentication, handle errors gracefully, and ensure proper error handling.",
        submissionInstructions: "Submit source code and documentation",
        submitAsFile: true,
        submitAsText: false,
        submitAsUrl: false,
      },
      {
        slug: "ui-component-task",
        title: "React Component Development",
        overview: "Create reusable UI components",
        description:
          "Design and implement a set of reusable React components following our design system guidelines.",
        instructions:
          "Use Storybook for documentation, ensure accessibility compliance, and write comprehensive tests.",
        submissionInstructions:
          "Submit component library and Storybook documentation",
        submitAsFile: true,
        submitAsText: false,
        submitAsUrl: false,
      },
    ],
  },
  {
    slug: "environmental-research-intern",
    title: "Environmental Research Intern",
    description:
      "Support our research team in collecting and analyzing environmental data. Participate in field studies and contribute to sustainability reports.",
    duration: "4 months",
    type: InternshipType.STIPEND,
    amount: 2000, // Monthly stipend
    location: "Portland, OR",
    requirements:
      "Environmental Science major, field research experience, data analysis skills",
    deadline: new Date("2024-07-30"),
    skills: ["Data Collection", "GIS", "Research", "Sustainability"],
    published: true,
    approved: true,
    tasks: [
      {
        slug: "data-collection-task",
        title: "Field Data Collection",
        overview: "Collect and document environmental samples",
        description:
          "Participate in field research activities, collect samples, and maintain detailed research logs.",
        instructions:
          "Follow safety protocols, use provided equipment, document all findings with timestamps and locations.",
        submissionInstructions: "Submit research log and sample analysis",
        submitAsFile: true,
        submitAsText: true,
        submitAsUrl: false,
      },
      {
        slug: "sustainability-report",
        title: "Sustainability Analysis Report",
        overview: "Analyze and report on sustainability metrics",
        description:
          "Compile and analyze data from various sources to create a comprehensive sustainability report.",
        instructions:
          "Use provided datasets, follow reporting guidelines, include visualizations and recommendations.",
        submissionInstructions: "Submit PDF report and raw data analysis",
        submitAsFile: true,
        submitAsText: false,
        submitAsUrl: false,
      },
    ],
  },
  {
    slug: "digital-marketing-intern",
    title: "Digital Marketing Intern",
    description:
      "Gain hands-on experience in digital marketing campaigns, SEO optimization, and social media strategy. Work with our marketing team to drive user engagement.",
    duration: "3 months",
    type: InternshipType.UNPAID,
    amount: null, // Unpaid internship
    location: "Remote",
    requirements:
      "Marketing or Business major, familiarity with social media platforms, analytical skills",
    deadline: new Date("2024-09-01"),
    skills: ["SEO", "Social Media", "Analytics", "Content Creation"],
    published: true,
    approved: true,
    tasks: [
      {
        slug: "seo-audit-task",
        title: "Website SEO Audit",
        overview: "Conduct comprehensive SEO analysis",
        description:
          "Perform detailed SEO audit of company website and provide actionable recommendations for improvement.",
        instructions:
          "Use SEO tools, analyze competitors, focus on technical SEO and content optimization opportunities.",
        submissionInstructions: "Submit audit report with recommendations",
        submitAsFile: true,
        submitAsText: true,
        submitAsUrl: false,
      },
      {
        slug: "social-campaign-task",
        title: "Social Media Campaign",
        overview: "Plan and execute social media campaign",
        description:
          "Develop and implement a social media marketing campaign across multiple platforms.",
        instructions:
          "Define target audience, create content calendar, track engagement metrics, and analyze results.",
        submissionInstructions:
          "Submit campaign report and performance metrics",
        submitAsFile: true,
        submitAsText: false,
        submitAsUrl: false,
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting realistic database seed...");

  try {
    // Clear existing data (optional - be careful in production)
    console.log("🗑️ Clearing existing data...");
    await prisma.taskEvaluation.deleteMany();
    await prisma.taskSubmission.deleteMany();
    await prisma.taskProgress.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.task.deleteMany();
    await prisma.internshipProgress.deleteMany();
    await prisma.application.deleteMany();
    await prisma.internship.deleteMany();
    await prisma.internProfile.deleteMany();
    await prisma.organizationProfile.deleteMany();
    await prisma.user.deleteMany();

    // 1️⃣ Create organization users + profiles
    const orgUsers = await Promise.all(
      ORGANIZATIONS.map((org) =>
        prisma.user.create({
          data: {
            email: org.email,
            name: org.name,
            role: Role.ORGANIZATION,
            organizationProfile: {
              create: {
                organizationName: org.organizationName,
                contactFirstName: org.contactFirstName,
                contactLastName: org.contactLastName,
                jobTitle: org.jobTitle,
                industry: org.industry,
                companySize: org.companySize,
                website: org.website,
                location: org.location,
                description: org.description,
                internshipGoals: org.internshipGoals,
              },
            },
          },
          include: { organizationProfile: true },
        }),
      ),
    );

    console.log(`✅ Created ${orgUsers.length} organizations`);

    // 2️⃣ Create intern users + profiles
    const internUsers = await Promise.all(
      INTERNS.map((intern) =>
        prisma.user.create({
          data: {
            email: intern.email,
            name: intern.name,
            role: Role.INTERN,
            internProfile: {
              create: {
                firstName: intern.firstName,
                lastName: intern.lastName,
                university: intern.university,
                major: intern.major,
                skills: intern.skills,
                bio: intern.bio,
              },
            },
          },
          include: { internProfile: true },
        }),
      ),
    );

    console.log(`✅ Created ${internUsers.length} interns`);

    // 3️⃣ Create internships for each organization
    const createdInternships = [];

    // Distribute internships evenly among organizations
    for (let i = 0; i < orgUsers.length; i++) {
      const orgUser = orgUsers[i];
      // Get internships for this organization (round-robin distribution)
      const orgInternships = INTERNSHIPS.filter(
        (_, index) => index % orgUsers.length === i,
      );

      for (const internshipData of orgInternships) {
        const { tasks, ...internshipWithoutTasks } = internshipData;

        const internship = await prisma.internship.create({
          data: {
            ...internshipWithoutTasks,
            organizationId: orgUser.organizationProfile!.id,
            tasks: {
              create: tasks,
            },
          },
          include: { tasks: true },
        });
        createdInternships.push(internship);
        console.log(`📝 Created internship: ${internship.title}`);
      }
    }

    console.log(`✅ Created ${createdInternships.length} internships`);

    // 4️⃣ Create realistic applications and progress
    let applicationCount = 0;
    let progressCount = 0;

    for (const internship of createdInternships) {
      // Each internship gets applications from 2-4 interns
      const applicationCountForInternship = Math.floor(Math.random() * 3) + 2;
      const shuffledInterns = [...internUsers].sort(() => 0.5 - Math.random());
      const selectedInterns = shuffledInterns.slice(
        0,
        applicationCountForInternship,
      );

      for (const intern of selectedInterns) {
        // Match interns with relevant internships based on skills/major
        const isGoodFit = isRelevantMatch(intern, internship);
        const status = isGoodFit
          ? ApplicationStatus.ACCEPTED
          : faker.helpers.arrayElement([
              ApplicationStatus.PENDING,
              ApplicationStatus.REJECTED,
            ]);

        const application = await prisma.application.create({
          data: {
            internId: intern.internProfile!.id,
            internshipId: internship.id,
            status,
            coverLetter: generateCoverLetter(intern, internship),
            resume: `https://${intern.internProfile!.firstName.toLowerCase()}-resume.com/pdf`,
          },
        });
        applicationCount++;

        // If accepted, create internship progress + task progress
        if (status === ApplicationStatus.ACCEPTED) {
          const internshipProgress = await prisma.internshipProgress.create({
            data: {
              internId: intern.internProfile!.id,
              internshipId: internship.id,
              progress: Math.floor(Math.random() * 30) + 10, // 10-40% progress
              status: InternshipStatus.IN_PROGRESS,
            },
          });

          for (const task of internship.tasks) {
            const taskStatus =
              Math.random() > 0.7
                ? TaskStatus.COMPLETED
                : TaskStatus.IN_PROGRESS;
            await prisma.taskProgress.create({
              data: {
                taskId: task.id,
                internId: intern.internProfile!.id,
                status: taskStatus,
                startedAt: new Date(),
              },
            });
            progressCount++;
          }
        }
      }
    }

    console.log(`✅ Created ${applicationCount} applications`);
    console.log(`✅ Created ${progressCount} task progress records`);
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Helper functions
function isRelevantMatch(intern: any, internship: any): boolean {
  const internMajor = intern.internProfile.major.toLowerCase();
  const internshipTitle = internship.title.toLowerCase();

  if (internshipTitle.includes("software") && internMajor.includes("computer"))
    return true;
  if (
    internshipTitle.includes("environmental") &&
    internMajor.includes("environmental")
  )
    return true;
  if (internshipTitle.includes("marketing") && internMajor.includes("business"))
    return true;
  if (internshipTitle.includes("design") && internMajor.includes("design"))
    return true;
  if (
    internshipTitle.includes("engineering") &&
    internMajor.includes("engineering")
  )
    return true;

  return Math.random() > 0.7; // 30% chance for other matches
}

function generateCoverLetter(intern: any, internship: any): string {
  return `Dear Hiring Team,

I am writing to express my interest in the ${internship.title} position. As a ${intern.internProfile.major} student at ${intern.internProfile.university}, I have developed strong skills in ${intern.internProfile.skills} that I believe align well with your requirements.

${intern.internProfile.bio}

I am excited about the opportunity to contribute to ${internship.title} and believe my background makes me a strong candidate for this position.

Sincerely,
${intern.internProfile.firstName} ${intern.internProfile.lastName}`;
}

// Execute seeding
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("Seeding error:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
