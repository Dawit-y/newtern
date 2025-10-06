import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { generateSlug } from "@/utils/common-methods";
import { taskBaseSchema } from "@/lib/validation/internships";

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      taskBaseSchema.refine(
        (data) => data.submitAsFile || data.submitAsText || data.submitAsUrl,
        {
          message: "At least one submission type is required",
          path: ["submitAsFile"],
        },
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title);

      const { resources, ...rest } = input;

      return ctx.db.task.create({
        data: {
          ...rest,
          slug,
          ...(resources && {
            resources: {
              create: resources.map((r) => ({
                name: r.name,
                type: r.type,
                description: r.description,
                url: r.url,
                file: r.file,
              })),
            },
          }),
        },
      });
    }),

  listPublic: publicProcedure
    .input(z.object({ internshipId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.task.findMany({
        where: { internshipId: input.internshipId },
        include: { resources: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  list: protectedProcedure
    .input(z.object({ internshipId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.task.findMany({
        where: { internshipId: input.internshipId },
        include: { resources: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  listByOrganizationId: protectedProcedure
    .input(z.object({ organizationId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.task.findMany({
        where: {
          internship: {
            organizationId: input.organizationId,
          },
        },
        include: {
          internship: true,
          resources: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  byId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ input, ctx }) => {
      return ctx.db.task.findUnique({
        where: { id: input },
        include: { resources: true },
      });
    }),

  byInternshipId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: { internshipId: input },
        include: { resources: true },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: taskBaseSchema.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { resources, ...rest } = input.data;

      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...(resources && {
            resources: {
              deleteMany: {}, // delete all old
              create: resources.map((r) => ({
                name: r.name,
                type: r.type,
                description: r.description,
                url: r.url,
                file: r.file,
              })),
            },
          }),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ input, ctx }) => {
      return ctx.db.task.delete({
        where: { id: input },
      });
    }),
});
