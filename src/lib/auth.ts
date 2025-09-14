import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db";
import { createAuthMiddleware } from "better-auth/api";

// Type definitions for better-auth context
interface AuthContext {
  path: string;
  context: {
    newSession?: {
      user?: {
        role?: string;
      };
    };
    returned?: {
      user?: Record<string, unknown>;
    } & Record<string, unknown>;
  };
}

// Type guard to check if context has the expected structure
function hasValidContext(ctx: unknown): ctx is AuthContext {
  if (typeof ctx !== "object" || ctx === null) {
    return false;
  }

  const ctxObj = ctx as Record<string, unknown>;
  return (
    "path" in ctxObj &&
    "context" in ctxObj &&
    typeof ctxObj.context === "object" &&
    ctxObj.context !== null
  );
}

// Helper function to safely get user role
function getUserRole(ctx: AuthContext): string | undefined {
  return ctx.context.newSession?.user?.role;
}

// Helper function to safely get existing user
function getExistingUser(
  ctx: AuthContext,
): Record<string, unknown> | undefined {
  return ctx.context.returned?.user;
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        returned: true,
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!hasValidContext(ctx) || ctx.path !== "/sign-in/email") {
        return;
      }

      // Safely extract role and existing user data
      const role = getUserRole(ctx);
      const existingUser = getExistingUser(ctx);

      // Only proceed if we have a valid role and user object
      if (role && existingUser) {
        // Ensure we have a proper returned object to spread
        const currentReturned = ctx.context.returned ?? {};
        ctx.context.returned = {
          ...currentReturned,
          user: {
            ...existingUser,
            role,
          },
        };
      }
    }),
  },
});
