import Link from "next/link";
import { HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import { SignOutButton } from "./_components/logout";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Newtern
          </h1>
          <p className="text-2xl font-bold tracking-tight sm:text-[2rem]">
            New way of having Internships
          </p>
          <div className="flex gap-4">
            {session?.user ? (
              <>
                <h1>Welcome, {session.user.email}</h1>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
