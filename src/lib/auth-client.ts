import { createAuthClient } from "better-auth/react";

// Create a SINGLE client instance and export its helpers.
// Use same-origin by default so auth cookies are scoped correctly.
export const authClient = createAuthClient({
  baseURL: typeof window === "undefined" ? process.env.NEXT_PUBLIC_APP_URL : "",
});

export const { signIn, signUp, useSession, signOut, getSession } = authClient;
