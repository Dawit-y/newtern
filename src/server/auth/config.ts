import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, req) => {
        const result = credentialsSchema.safeParse(credentials);

        if (!result.success) {
          console.log("credentialsSchema result", result);
          return null;
        }

        const { email, password } = result.data;

        const user = await db.user.findUnique({
          where: { email },
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
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
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
