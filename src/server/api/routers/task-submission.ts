import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  taskSubmissionSchema,
  submissionStatusEnum,
} from "@/lib/validation/task-submission";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getInternProfileOrThrow } from "@/server/lib/helpers/intern";
import {
  assertOrganization,
  assertOrgOwnsTask,
} from "@/server/lib/helpers/auth";

export const taskSubmissionRouter = createTRPCRouter({
  // Intern submits a task
  create: protectedProcedure
    .input(taskSubmissionSchema.omit({ internId: true, status: true }))
    .mutation(async ({ input, ctx }) => {
      // Only interns can create submissions
      const internProfile = await getInternProfileOrThrow(
        ctx.db,
        ctx.session.user.id,
      );

      // Check if submission already exists for this task
      const existingSubmission = await ctx.db.taskSubmission.findUnique({
        where: {
          taskId_internId: {
            taskId: input.taskId,
            internId: internProfile.id,
          },
        },
      });

      if (existingSubmission) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already submitted this task",
        });
      }

      return ctx.db.taskSubmission.create({
        data: {
          ...input,
          internId: internProfile.id,
          status: "SUBMITTED",
        },
      });
    }),

  // Intern updates their submission
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: taskSubmissionSchema
          .omit({ internId: true, taskId: true })
          .partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const internProfile = await getInternProfileOrThrow(
        ctx.db,
        ctx.session.user.id,
      );

      const submission = await ctx.db.taskSubmission.findUnique({
        where: { id: input.id },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      if (submission.internId !== internProfile.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own submissions",
        });
      }

      // Only allow updates if not already accepted/rejected
      if (["ACCEPTED", "REJECTED"].includes(submission.status)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update a finalized submission",
        });
      }

      return ctx.db.taskSubmission.update({
        where: { id: input.id },
        data: { ...input.data },
      });
    }),

  // Intern views their own submissions
  listMySubmissions: protectedProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const internProfile = await getInternProfileOrThrow(
        ctx.db,
        ctx.session.user.id,
      );

      return ctx.db.taskSubmission.findMany({
        skip: input?.skip,
        take: input?.take,
        where: { internId: internProfile.id },
        include: {
          task: {
            include: {
              internship: true,
            },
          },
          evaluation: {
            include: {
              organization: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      });
    }),

  // Organization views submissions for their tasks
  listForOrganization: protectedProcedure
    .input(
      z.object({
        skip: z.number().min(0).default(0),
        take: z.number().min(1).max(50).default(10),
        status: submissionStatusEnum.optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      assertOrganization(ctx);

      const orgProfile = await ctx.db.organizationProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!orgProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization profile not found",
        });
      }

      return ctx.db.taskSubmission.findMany({
        skip: input.skip,
        take: input.take,
        where: {
          task: {
            internship: {
              organizationId: orgProfile.id,
            },
          },
          status: input.status,
        },
        include: {
          task: {
            include: {
              internship: true,
            },
          },
          intern: {
            include: {
              user: true,
            },
          },
          evaluation: true,
        },
        orderBy: { submittedAt: "desc" },
      });
    }),

  // Get specific submission
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const submission = await ctx.db.taskSubmission.findUnique({
        where: { id: input.id },
        include: {
          task: {
            include: {
              internship: true,
            },
          },
          intern: {
            include: {
              user: true,
            },
          },
          evaluation: {
            include: {
              organization: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      // Check permissions
      if (ctx.session.user.role === "INTERN") {
        const internProfile = await getInternProfileOrThrow(
          ctx.db,
          ctx.session.user.id,
        );
        if (submission.internId !== internProfile.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only view your own submissions",
          });
        }
      } else if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsTask(ctx, { taskId: submission.taskId });
      }

      return submission;
    }),

  // Update submission status (organization only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: submissionStatusEnum,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      assertOrganization(ctx);

      const submission = await ctx.db.taskSubmission.findUnique({
        where: { id: input.id },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      await assertOrgOwnsTask(ctx, { taskId: submission.taskId });

      return ctx.db.taskSubmission.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
