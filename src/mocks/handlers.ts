import { http, HttpResponse } from "msw";

// Example handlers. Add real API endpoints as needed.
export const handlers = [
  http.get("/api/health", () => HttpResponse.json({ status: "ok" })),

  // Example tRPC handler: adjust base path if different in your app
  http.post("/api/trpc/:router", async ({ params }) => {
    const { router } = params as { router: string };
    return HttpResponse.json({ router, ok: true });
  }),
];


