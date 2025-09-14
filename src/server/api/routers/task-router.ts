import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { generateSlug } from "@/utils/common-methods";
import { taskSchema } from "@/lib/validation/internships";

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title);

      return ctx.db.task.create({
        data: {
          ...input,
          slug,
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

  byId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ input, ctx }) => {
      return ctx.db.task.findUnique({
        where: { id: input },
        include: { resources: true },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: taskSchema.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: input.data,
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
