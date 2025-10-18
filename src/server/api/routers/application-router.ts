import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  applicationSchema,
  applicationStatusEnum,
} from "@/lib/validation/applications";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getOrgProfileOrThrow } from "@/server/lib/helpers/org";
import {
  assertNotIntern,
  assertOrganization,
  assertAdmin,
  assertOrgOwnsInternship,
} from "@/server/lib/helpers/auth";

export const applicationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(applicationSchema.omit({ status: true }))
    .mutation(async ({ input, ctx }) => {
      assertNotIntern(ctx);
      return ctx.db.application.create({
        data: {
          ...input,
        },
      });
    }),
  list: protectedProcedure
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

      const orgProfile = await getOrgProfileOrThrow(
        ctx.db,
        ctx.session.user.id,
      );
      const internships = await ctx.db.internship.findMany({
        where: { organizationId: orgProfile.id },
        select: { id: true },
      });
      const internshipIds = internships.map((internship) => internship.id);
      return ctx.db.application.findMany({
        skip: input?.skip,
        take: input?.take,
        where: { internshipId: { in: internshipIds } },
        include: {
          internship: true,
          intern: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
  listAll: protectedProcedure.query(async ({ ctx }) => {
    assertAdmin(ctx);
    return ctx.db.application.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      assertNotIntern(ctx);
      const application = await ctx.db.application.findUnique({
        where: { id: input.id },
        include: {
          internship: true,
          intern: true,
        },
      });
      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, {
          organizationId: application.internshipId,
        });
      }
      return application;
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: applicationStatusEnum,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      assertNotIntern(ctx);
      const application = await ctx.db.application.findUnique({
        where: { id: input.id },
      });
      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, {
          internshipId: application.internshipId,
        });
      }
      return ctx.db.application.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: applicationSchema.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      assertNotIntern(ctx);
      const application = await ctx.db.application.findUnique({
        where: { id: input.id },
      });
      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, {
          internshipId: application.internshipId,
        });
      }
      return ctx.db.application.update({
        where: { id: input.id },
        data: { ...input.data },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      assertNotIntern(ctx);
      const application = await ctx.db.application.findUnique({
        where: { id: input.id },
      });
      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }
      if (ctx.session.user.role === "ORGANIZATION") {
        await assertOrgOwnsInternship(ctx, {
          internshipId: application.internshipId,
        });
      }
      return ctx.db.application.delete({
        where: { id: input.id },
      });
    }),
});
