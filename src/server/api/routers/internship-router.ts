import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { internshipSchema } from "@/lib/validation/internships";
import { type TaskStatus } from "@/lib/validation/progress";
import { type ApplicationStatus } from "@/lib/validation/applications";
import { z } from "zod";
import { generateSlug } from "@/utils/common-methods";
import { TRPCError } from "@trpc/server";
import {
  getOrgProfileOrThrow,
  getInternProfileOrThrow,
} from "@/server/lib/helpers/org";
import {
  assertNotIntern,
  assertOrganization,
  assertOrgOwnsInternship,
} from "@/server/lib/helpers/auth";

export const internshipsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(internshipSchema)
    .mutation(async ({ input, ctx }) => {
      assertOrganization(ctx);

      const slug = generateSlug(input.title);
      const orgProfile = await getOrgProfileOrThrow(
        ctx.db,
        ctx.session.user.id,
      );

      return ctx.db.internship.create({
        data: {
          ...input,
          slug,
          organizationId: orgProfile.id,
        },
      });
    }),

  listPublic: publicProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.internship.findMany({
        skip: input?.skip,
        take: input?.take,
        where: { published: true, approved: true },
        orderBy: { createdAt: "desc" },
        include: {
          organization: true,
          _count: {
            select: {
              tasks: true,
              applications: true,
            },
          },
        },
      });
    }),

  listForIntern: protectedProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const { id } = ctx.session.user;
      const internProfile = await getInternProfileOrThrow(ctx.db, id);

      const total = await ctx.db.internship.count({
        where: { published: true, approved: true },
      });

      const internships = await ctx.db.internship.findMany({
        skip: input?.skip,
        take: input?.take,
        where: {
          published: true,
          approved: true,
        },
        include: {
          organization: true,
          applications: {
            where: { internId: internProfile.id },
          },
          _count: {
            select: { tasks: true, applications: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        items: internships.map((internship) => ({
          ...internship,
          applications:
            internship.applications.length > 0
              ? internship.applications[0]
              : null,
        })),
        total,
      };
    }),

  listForOrganization: protectedProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
          published: z.boolean().optional(),
          approved: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const orgProfile = await getOrgProfileOrThrow(
        ctx.db,
        ctx.session.user.id,
      );

      return ctx.db.internship.findMany({
        skip: input?.skip,
        take: input?.take,
        where: {
          organizationId: orgProfile.id,
          published: input?.published,
          approved: input?.approved,
        },
        include: {
          _count: {
            select: { tasks: true, applications: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  listForAdmin: protectedProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
          published: z.boolean().optional(),
          approved: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.internship.findMany({
        skip: input?.skip,
        take: input?.take,
        where: {
          published: input?.published,
          approved: input?.approved,
        },
        include: {
          organization: true,
          _count: {
            select: { tasks: true, applications: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  myInternships: protectedProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const { id, role } = ctx.session.user;

      if (role !== "INTERN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only interns can access this",
        });
      }

      const internProfile = await ctx.db.internProfile.findUnique({
        where: { userId: id },
        select: { id: true },
      });

      if (!internProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Intern profile not found",
        });
      }

      const internships = await ctx.db.internship.findMany({
        skip: input?.skip,
        take: input?.take,
        where: {
          OR: [
            { applications: { some: { internId: internProfile.id } } },
            { internshipProgress: { some: { internId: internProfile.id } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          organization: true,
          internshipProgress: {
            where: {
              internId: internProfile.id,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              taskProgress: {
                where: { internId: internProfile.id },
                select: {
                  status: true,
                  completedAt: true,
                },
              },
            },
          },
          _count: {
            select: {
              applications: true,
              tasks: true,
            },
          },
        },
      });

      return internships.map((internship) => ({
        ...internship,
        internshipProgress:
          internship.internshipProgress.length > 0
            ? internship.internshipProgress[0]
            : null,
      }));
    }),

  byId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ input, ctx }) => {
      const internship = await ctx.db.internship.findUnique({
        where: { id: input },
        include: {
          tasks: {
            include: {
              resources: true,
            },
          },
        },
      });

      if (!internship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Internship not found",
        });
      }

      return internship;
    }),

  bySlug: publicProcedure
    .input(z.string())
    .query(async ({ input: slug, ctx }) => {
      // --- Get the intern profile if logged in as INTERN ---
      let internProfileId: string | null = null;
      if (ctx.session?.user?.role === "INTERN") {
        const internProfile = await ctx.db.internProfile.findUnique({
          where: { userId: ctx.session.user.id },
          select: { id: true },
        });
        internProfileId = internProfile?.id ?? null;
      }

      const internship = await ctx.db.internship.findUnique({
        where: { slug },
        include: {
          organization: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          tasks: {
            include: {
              resources: true,
            },
          },
          _count: {
            select: {
              applications: true,
              tasks: true,
            },
          },
        },
      });

      if (!internship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Internship not found",
        });
      }

      // --- Fetch user application info ---
      let userApplication: null | {
        id: string;
        status: ApplicationStatus;
        createdAt: Date;
      } = null;

      if (internProfileId) {
        userApplication = await ctx.db.application.findFirst({
          where: {
            internshipId: internship.id,
            internId: internProfileId,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        });
      }

      // --- Fetch internship progress (if intern is accepted) ---
      let internshipProgress: null | {
        id: string;
        progress: number;
        status: string;
        startedAt: Date;
        completedAt: Date | null;
      } = null;

      if (internProfileId && userApplication?.status === "ACCEPTED") {
        internshipProgress = await ctx.db.internshipProgress.findUnique({
          where: {
            internId_internshipId: {
              internId: internProfileId,
              internshipId: internship.id,
            },
          },
          select: {
            id: true,
            progress: true,
            status: true,
            startedAt: true,
            completedAt: true,
          },
        });
      }

      type TaskWithProgress = (typeof internship.tasks)[number] & {
        progress: {
          status: TaskStatus;
          startedAt: Date | null;
          completedAt: Date | null;
        };
      };

      // --- If logged in as intern, attach task progress ---
      let tasksWithProgress: TaskWithProgress[] | null = null;
      if (internProfileId) {
        const progressRecords = await ctx.db.taskProgress.findMany({
          where: {
            internId: internProfileId,
            taskId: { in: internship.tasks.map((t) => t.id) },
          },
          select: {
            taskId: true,
            status: true,
            startedAt: true,
            completedAt: true,
          },
        });

        const progressMap = Object.fromEntries(
          progressRecords.map((p) => [p.taskId, p]),
        );

        tasksWithProgress = internship.tasks.map((task) => ({
          ...task,
          progress: progressMap[task.id] ?? {
            status: "NOT_STARTED",
            startedAt: null,
            completedAt: null,
          },
        }));
      }

      // --- Return the enhanced internship ---
      return {
        ...internship,
        tasks: tasksWithProgress,
        userApplication,
        progress: internshipProgress,
      };
    }),

  byOrganizationId: protectedProcedure
    .input(z.string().cuid())
    .query(async ({ input, ctx }) => {
      const internships = await ctx.db.internship.findMany({
        where: { organizationId: input },
        include: { tasks: true },
      });
      return internships;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: internshipSchema.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const internship = await ctx.db.internship.findUnique({
        where: { id: input.id },
      });

      if (!internship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Internship not found",
        });
      }

      assertNotIntern(ctx);

      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, internship);
      }

      let slug = internship.slug;
      if (
        !internship.published &&
        input.data.title &&
        input.data.title.trim() !== internship.title.trim()
      ) {
        slug = generateSlug(input.data.title);
      }

      return ctx.db.internship.update({
        where: { id: input.id },
        data: { ...input.data, slug },
      });
    }),

  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ input, ctx }) => {
      const internship = await ctx.db.internship.findUnique({
        where: { id: input },
      });

      if (!internship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Internship not found",
        });
      }

      assertNotIntern(ctx);

      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, internship);
      }

      return ctx.db.internship.delete({
        where: { id: input },
      });
    }),

  publish: protectedProcedure
    .input(
      z.object({
        internshipId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const internship = await ctx.db.internship.findUnique({
        where: { id: input.internshipId },
      });

      if (!internship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Internship not found",
        });
      }

      assertNotIntern(ctx);

      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, internship);
      }

      await ctx.db.internship.update({
        where: { id: input.internshipId },
        data: { published: true },
      });

      return internship;
    }),
});
