import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Adapter } from "next-auth/adapters";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "@/server/db";

import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["INTERN", "ORGANIZATION"]),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    // ...other properties
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
// Debug environment variables
console.log("Auth Config Environment Variables:", {
  AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT SET",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET",
  DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
});

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        role: {},
      },
      authorize: async (credentials) => {
        console.log("credentials on config", credentials);
        const result = credentialsSchema.safeParse(credentials);

        if (!result.success) {
          console.log("credentialsSchema result", result);
          return null;
        }

        const { email, password, role } = result.data;

        try {
          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              emailVerified: true,
              image: true,
              password: true,
              role: true,
            },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          if (user.role !== role) {
            throw new Error(
              `Invalid role. This account is registered as ${user.role}`,
            );
          }

          if (!user.password) {
            throw new Error(
              "This account was created with Google. Please use Google sign-in.",
            );
          }

          const isValid: boolean = await bcrypt.compare(
            password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error("Database error in authorize:", error);
          throw error;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // or your custom login route
    signOut: "/", // optional
    error: "/error", // redirect here on errors
  },
  // callbacks: {
  //   session: async ({ session, user }) => {
  //     return {
  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: user.id,
  //       },
  //     };
  //   },
  // },
  debug: true,
} satisfies NextAuthConfig;
