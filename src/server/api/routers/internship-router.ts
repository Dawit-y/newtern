import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { internshipSchema } from "@/lib/validation/internships";
import { z } from "zod";
import { generateSlug } from "@/utils/common-methods";
import { TRPCError } from "@trpc/server";
import { getOrgProfileOrThrow } from "@/server/lib/helpers/org";
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
      });
    }),

  list: protectedProcedure
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
      const { role, id } = ctx.session.user;

      if (role === "ORGANIZATION") {
        const orgProfile = await getOrgProfileOrThrow(ctx.db, id);
        return ctx.db.internship.findMany({
          skip: input?.skip,
          take: input?.take,
          where: {
            organizationId: orgProfile.id,
            published: input?.published,
            approved: input?.approved,
          },
          orderBy: { createdAt: "desc" },
        });
      }

      if (role === "ADMIN") {
        return ctx.db.internship.findMany({
          skip: input?.skip,
          take: input?.take,
          where: {
            published: input?.published,
            approved: input?.approved,
          },
          orderBy: { createdAt: "desc" },
        });
      }

      return []; // interns cannot list all
    }),

  byId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ input, ctx }) => {
      const internship = await ctx.db.internship.findUnique({
        where: { id: input },
        include: { tasks: true },
      });

      if (!internship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Internship not found",
        });
      }

      return internship;
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
