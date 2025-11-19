import InternshipHeader from "@/components/intern/internship-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";

export default async function InternshipLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let internship;

  try {
    internship = await api.internships.bySlug(slug);
  } catch (err) {
    if (err instanceof TRPCError && err.code === "NOT_FOUND") {
      notFound();
    }

    throw err;
  }

  return (
    <main className="from-background to-muted/20 flex items-center justify-center bg-gradient-to-b">
      <div className="container px-4 py-8 md:px-6">
        <Link href="/dashboard/intern">
          <Button variant="ghost" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <InternshipHeader internship={internship} />
        <div className="">{children}</div>
      </div>
    </main>
  );
}
