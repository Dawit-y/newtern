import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "@/mocks/server";

// MUST happen before any server code executes
vi.mock("@/env", () => ({
  env: {
    NODE_ENV: "test",
    BETTER_AUTH_SECRET: "something",
    BETTER_AUTH_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    DATABASE_URL: "test-url",
  },
}));

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios) so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
