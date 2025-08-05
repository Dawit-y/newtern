import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Adapter } from "next-auth/adapters";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "@/server/db";

import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
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
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const result = credentialsSchema.safeParse(credentials);

        if (!result.success) {
          console.log("credentialsSchema result", result);
          return null;
        }

        const { email, password } = result.data;

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

        if (user?.password) {
          const isValid: boolean = await bcrypt.compare(
            password,
            user.password,
          );
          if (isValid) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
        }

        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email ?? "" },
        });

        if (existingUser?.password) {
          // User registered via credentials, block Google login
          throw new Error(
            "Email already registered with credentials. Please log in with email and password.",
          );
        }
      }

      return true; // allow login
    },
  },
  pages: {
    signIn: "/login", // or your custom login route
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
