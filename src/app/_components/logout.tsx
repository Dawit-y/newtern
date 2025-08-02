"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full bg-white/10 px-6 py-2 transition hover:bg-white/20"
    >
      Sign Out
    </button>
  );
}
