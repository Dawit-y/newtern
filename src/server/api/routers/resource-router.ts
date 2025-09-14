import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { resourceSchema } from "@/lib/validation/internships";

export const resourcesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(resourceSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.resource.create({
        data: input,
      });
    }),

  listPublic: publicProcedure
    .input(z.object({ taskId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.resource.findMany({
        where: { taskId: input.taskId },
        orderBy: { createdAt: "desc" },
      });
    }),

  list: protectedProcedure
    .input(z.object({ taskId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.resource.findMany({
        where: { taskId: input.taskId },
        orderBy: { createdAt: "desc" },
      });
    }),

  byId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ input, ctx }) => {
      return ctx.db.resource.findUnique({
        where: { id: input },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: resourceSchema.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.resource.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ input, ctx }) => {
      return ctx.db.resource.delete({
        where: { id: input },
      });
    }),
});
