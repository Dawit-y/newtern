import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { internshipSchema } from "@/lib/validation/internships";
import { z } from "zod";
import { generateSlug } from "@/utils/common-methods";
import { TRPCError } from "@trpc/server";
import { getOrgProfileOrThrow } from "@/lib/helpers/org";

export const internshipsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(internshipSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title);

      if (ctx.session.user.role !== "ORGANIZATION") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only organizations can create internships",
        });
      }

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
        where: {
          published: true,
          approved: true,
        },
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

      // Interns can’t list all
      return [];
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

      const { role, id } = ctx.session.user;

      if (role === "INTERN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }

      if (role === "ORGANIZATION") {
        const orgProfile = await getOrgProfileOrThrow(ctx.db, id);
        if (internship.organizationId !== orgProfile.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authorized",
          });
        }
      }

      return ctx.db.internship.update({
        where: { id: input.id },
        data: input.data,
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

      const { role, id } = ctx.session.user;

      if (role === "INTERN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }

      if (role === "ORGANIZATION") {
        const orgProfile = await getOrgProfileOrThrow(ctx.db, id);
        if (internship.organizationId !== orgProfile.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authorized",
          });
        }
      }

      return ctx.db.internship.delete({
        where: { id: input },
      });
    }),
});
