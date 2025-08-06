"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Users, Building2 } from "lucide-react";
import Link from "next/link";
import InternSignupForm from "@/components/auth/intern-signup-form";
import OrganizationSignupForm from "@/components/auth/organization-signup-form";

export default function SignUpPage() {
  return (
    <div className="from-primary/5 via-background to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="text-primary h-8 w-8" />
            <span className="text-primary text-2xl font-bold">Newtern</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join thousands of interns and organizations on Newtern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="intern" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="intern" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  I&apos;m an Intern
                </TabsTrigger>
                <TabsTrigger
                  value="organization"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  I&apos;m an Organization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="intern">
                <InternSignupForm />
              </TabsContent>

              <TabsContent value="organization">
                <OrganizationSignupForm />
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator />
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/auth/signin"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
