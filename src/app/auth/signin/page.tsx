"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Users, Building2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    userType: "intern" | "organization",
  ) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log(`Signing in as ${userType}`);
  };

  return (
    <div className="from-primary/5 via-background to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="text-primary h-8 w-8" />
            <span className="text-primary text-2xl font-bold">Newtern</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="intern" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="intern" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Intern
                </TabsTrigger>
                <TabsTrigger
                  value="organization"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Organization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="intern">
                <form
                  onSubmit={(e) => handleSubmit(e, "intern")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="intern-email">Email</Label>
                    <Input
                      id="intern-email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intern-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="intern-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Intern"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="organization">
                <form
                  onSubmit={(e) => handleSubmit(e, "organization")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Organization Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="Enter your organization email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="org-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Organization"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator />
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/auth/signup"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
