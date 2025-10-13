import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
      <div className="flex items-center gap-2">
        <Briefcase className="text-primary h-6 w-6" />
        <span className="text-sm font-medium">Newtern</span>
      </div>
      <p className="text-muted-foreground text-xs">
        © 2024 Newtern. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <Link href="#" className="text-xs underline-offset-4 hover:underline">
          Help Center
        </Link>
        <Link href="#" className="text-xs underline-offset-4 hover:underline">
          Settings
        </Link>
        <Link href="#" className="text-xs underline-offset-4 hover:underline">
          Feedback
        </Link>
      </nav>
    </footer>
  );
}
