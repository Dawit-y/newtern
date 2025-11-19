import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { taskEvaluationSchema } from "@/lib/validation/task-evaluation";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  assertOrganization,
  assertAdmin,
  assertOrgOwnsTaskSubmission,
} from "@/server/lib/helpers/auth";

export const taskEvaluationRouter = createTRPCRouter({
  // Organization creates/updates an evaluation
  evaluate: protectedProcedure
    .input(taskEvaluationSchema.omit({ organizationId: true }))
    .mutation(async ({ input, ctx }) => {
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

      // Check if submission exists and organization owns it
      const submission = await ctx.db.taskSubmission.findUnique({
        where: { id: input.taskSubmissionId },
        include: {
          task: {
            include: {
              internship: true,
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

      if (submission.task.internship.organizationId !== orgProfile.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only evaluate submissions for your organization",
        });
      }

      // Check if evaluation already exists
      const existingEvaluation = await ctx.db.taskEvaluation.findUnique({
        where: { taskSubmissionId: input.taskSubmissionId },
      });

      if (existingEvaluation) {
        // Update existing evaluation
        return ctx.db.taskEvaluation.update({
          where: { id: existingEvaluation.id },
          data: {
            score: input.score,
            feedback: input.feedback,
            evaluatedAt: new Date(),
          },
        });
      } else {
        // Create new evaluation
        return ctx.db.taskEvaluation.create({
          data: {
            ...input,
            organizationId: orgProfile.id,
          },
        });
      }
    }),

  // Get evaluation for a submission
  getBySubmissionId: protectedProcedure
    .input(z.object({ taskSubmissionId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const evaluation = await ctx.db.taskEvaluation.findUnique({
        where: { taskSubmissionId: input.taskSubmissionId },
        include: {
          organization: {
            include: {
              user: true,
            },
          },
          taskSubmission: {
            include: {
              task: true,
              intern: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!evaluation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evaluation not found",
        });
      }

      // Check permissions
      if (ctx.session.user.role === "INTERN") {
        const internProfile = await ctx.db.internProfile.findUnique({
          where: { userId: ctx.session.user.id },
        });
        if (evaluation.taskSubmission.internId !== internProfile?.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only view evaluations for your own submissions",
          });
        }
      } else if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsTaskSubmission(ctx, {
          taskSubmissionId: input.taskSubmissionId,
        });
      }

      return evaluation;
    }),

  // List evaluations for organization
  listForOrganization: protectedProcedure
    .input(
      z
        .object({
          skip: z.number().min(0).default(0),
          take: z.number().min(1).max(50).default(10),
        })
        .optional(),
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

      return ctx.db.taskEvaluation.findMany({
        skip: input?.skip,
        take: input?.take,
        where: { organizationId: orgProfile.id },
        include: {
          taskSubmission: {
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
            },
          },
        },
        orderBy: { evaluatedAt: "desc" },
      });
    }),

  // Admin: List all evaluations
  listAll: protectedProcedure.query(async ({ ctx }) => {
    assertAdmin(ctx);
    return ctx.db.taskEvaluation.findMany({
      include: {
        taskSubmission: {
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
          },
        },
        organization: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { evaluatedAt: "desc" },
    });
  }),

  // Delete evaluation (organization only)
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      assertOrganization(ctx);

      const evaluation = await ctx.db.taskEvaluation.findUnique({
        where: { id: input.id },
      });

      if (!evaluation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evaluation not found",
        });
      }

      await assertOrgOwnsTaskSubmission(ctx, {
        taskSubmissionId: evaluation.taskSubmissionId,
      });

      return ctx.db.taskEvaluation.delete({
        where: { id: input.id },
      });
    }),
});
