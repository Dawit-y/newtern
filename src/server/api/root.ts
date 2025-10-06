import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "@/server/api/routers/auth-router";
import { internshipsRouter } from "./routers/internship-router";
import { tasksRouter } from "./routers/task-router";
import { resourcesRouter } from "./routers/resource-router";
import { profilesRouter } from "./routers/profile-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  internships: internshipsRouter,
  tasks: tasksRouter,
  resources: resourcesRouter,
  profiles: profilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
