import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Internship Not Found</h2>
      <p className="text-muted-foreground">
        The internship you’re looking for doesn’t exist or may have been
        removed.
      </p>
      <Link href="/dashboard/intern">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
