"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutDropdownItem } from "@/components/auth/sign-out";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/mode-toggle";

type NavLink = {
  href: string;
  label: string;
};

interface HeaderProps {
  links?: NavLink[];
}

export default function NavBar({ links = [] }: HeaderProps) {
  const { data: session, isPending } = useSession();

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 items-center border-b px-4 backdrop-blur lg:px-6">
        <Link href="/" className="flex items-center justify-center">
          <Briefcase className="text-primary h-8 w-8" />
          <span className="text-primary ml-2 text-2xl font-bold">Newtern</span>
        </Link>

        <nav className="ml-auto flex gap-4 sm:gap-6">
          {links.map((link) => (
            <Skeleton key={link.href} className="h-4 w-16" />
          ))}
        </nav>

        <div className="ml-6 flex gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </header>
    );
  }

  // Determine dashboard path safely
  const role = session?.user?.role;
  let dashboardPath = "/dashboard";
  if (role === "ADMIN") dashboardPath = "/dashboard/admin";
  if (role === "ORGANIZATION") dashboardPath = "/dashboard/organization";
  if (role === "INTERN") dashboardPath = "/dashboard/intern";

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 backdrop-blur lg:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center">
        <Briefcase className="text-primary h-8 w-8" />
        <span className="text-primary ml-2 text-2xl font-bold">Newtern</span>
      </Link>

      <div className="flex items-center justify-between gap-4">
        {/* Navigation */}
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ModeToggle />

        {/* User section */}
        <div className="flex gap-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? "User"}
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={dashboardPath}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <SignOutDropdownItem />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
