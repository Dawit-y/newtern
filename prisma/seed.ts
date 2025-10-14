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

async function main() {
  console.log("🌱 Starting database seed...");

  // 1️⃣ Create an organization user + profile
  const orgUser = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: Role.ORGANIZATION,
      organizationProfile: {
        create: {
          organizationName: faker.company.name(),
          contactFirstName: faker.person.firstName(),
          contactLastName: faker.person.lastName(),
          jobTitle: faker.person.jobTitle(),
          industry: faker.commerce.department(),
          companySize: "51-200",
          website: faker.internet.url(),
          location: faker.location.city(),
          description: faker.lorem.paragraph(),
          internshipGoals: faker.lorem.sentence(),
        },
      },
    },
    include: { organizationProfile: true },
  });

  // 2️⃣ Create some intern users + profiles
  const interns = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          role: Role.INTERN,
          internProfile: {
            create: {
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              university: faker.company.name(),
              major: faker.commerce.department(),
              skills: faker.lorem.words(4),
              bio: faker.lorem.sentence(),
            },
          },
        },
        include: { internProfile: true },
      }),
    ),
  );

  // 3️⃣ Create internships for the organization
  const internships = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.internship.create({
        data: {
          slug: faker.lorem.slug(),
          title: faker.person.jobTitle() + " Internship",
          description: faker.lorem.paragraphs(2),
          duration: `${faker.number.int({ min: 2, max: 6 })} months`,
          type: faker.helpers.arrayElement(Object.values(InternshipType)),
          location: faker.location.city(),
          requirements: faker.lorem.sentence(),
          deadline: faker.date.future(),
          skills: [faker.hacker.verb(), faker.hacker.noun()],
          published: true,
          approved: true,
          organizationId: orgUser.organizationProfile!.id,
          tasks: {
            create: Array.from({ length: 3 }).map(() => ({
              slug: faker.lorem.slug(),
              title: faker.hacker.phrase(),
              overview: faker.lorem.sentence(),
              description: faker.lorem.paragraph(),
              instructions: faker.lorem.sentences(2),
              submissionInstructions: faker.lorem.sentence(),
              submitAsFile: true,
              submitAsText: true,
            })),
          },
        },
        include: { tasks: true },
      }),
    ),
  );

  // 4️⃣ Create applications and progress for some interns
  for (const internship of internships) {
    for (const intern of interns) {
      const status = faker.helpers.arrayElement(
        Object.values(ApplicationStatus),
      );
      const application = await prisma.application.create({
        data: {
          internId: intern.internProfile!.id,
          internshipId: internship.id,
          status,
          coverLetter: faker.lorem.paragraph(),
          resume: faker.internet.url(),
        },
      });

      // If accepted, create internship progress + task progress
      if (status === ApplicationStatus.ACCEPTED) {
        const internshipProgress = await prisma.internshipProgress.create({
          data: {
            internId: intern.internProfile!.id,
            internshipId: internship.id,
            progress: faker.number.float({ min: 0, max: 100 }),
            status: faker.helpers.arrayElement(Object.values(InternshipStatus)),
          },
        });

        for (const task of internship.tasks) {
          await prisma.taskProgress.create({
            data: {
              taskId: task.id,
              internId: intern.internProfile!.id,
              status: faker.helpers.arrayElement(Object.values(TaskStatus)),
            },
          });
        }
      }
    }
  }

  console.log("✅ Database seeding completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
