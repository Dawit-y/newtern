import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Global Not Found</h2>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
