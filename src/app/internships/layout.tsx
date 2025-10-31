import "@/styles/globals.css";

import { type Metadata } from "next";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/nav-bar";

export const metadata: Metadata = {
  title: "Newtern",
  description: "Virtual Internships Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const navLinks = [
  { href: "#browse", label: "Browse" },
  { href: "#my-internships", label: "My Internships" },
  { href: "#achievements", label: "Achievements" },
];

export default function InternshipsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar links={navLinks} />
        <div className="mx-6">{children}</div>
        <Footer />
      </div>
    </>
  );
}
