import "@/styles/globals.css";

import { type Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/nav-bar";

export const metadata: Metadata = {
  title: "Newtern | Intern",
  description: "Virtual Internships Platform - Intern",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const navLinks = [
  { href: "#browse", label: "Browse" },
  { href: "#my-internships", label: "My Internships" },
  { href: "#achievements", label: "Achievements" },
];


export default async function InternLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.role !== "INTERN") {
    redirect("/");
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar links={navLinks} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
