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
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

type SignInFormValues = {
  email: string;
  password: string;
  role: "INTERN" | "ORGANIZATION" | "ADMIN";
};

// Type definitions for better-auth response
type UserRole = "INTERN" | "ORGANIZATION" | "ADMIN";

interface AuthResponse {
  data?: {
    user?: {
      role?: UserRole;
      id?: string;
      email?: string;
      name?: string;
    };
  };
  error?: {
    message?: string;
  };
}

// Type guard to check if response has user data
function hasUserData(response: unknown): response is AuthResponse {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const responseObj = response as Record<string, unknown>;
  return (
    "data" in responseObj &&
    typeof responseObj.data === "object" &&
    responseObj.data !== null
  );
}

// Helper function to safely get user role
function getUserRole(response: AuthResponse): UserRole | undefined {
  return response.data?.user?.role;
}

export const dynamic = "force-dynamic";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
  } = useForm<SignInFormValues>({
    mode: "onBlur",
    defaultValues: {
      role: "INTERN",
    },
  });

  const handleTabChange = (value: string) => {
    if (value === "intern" || value === "organization") {
      setValue("role", value === "intern" ? "INTERN" : "ORGANIZATION");
      clearErrors();
    }
  };

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: async (ctx) => {
            if (!hasUserData(ctx)) {
              toast.error("Invalid response from server");
              return;
            }

            const role = getUserRole(ctx);
            if (role === "ADMIN") {
              router.push("/dashboard/admin");
              return;
            }
            if (role !== data.role) {
              const roleText = role?.toLowerCase() ?? "unknown";
              toast.error(
                `You are trying to sign in as a ${data.role.toLowerCase()}, but your account is registered as a ${roleText}. Please use the correct sign-in option.`,
              );
              return;
            }

            // Handle role-based routing
            if (role === "INTERN") {
              router.push("/dashboard/intern");
            } else if (role === "ORGANIZATION") {
              router.push("/dashboard/organization");
            } else if (role === "ADMIN") {
              router.push("/dashboard/admin");
            }
          },
          onError: (ctx) => {
            if (hasUserData(ctx) && ctx.error?.message) {
              toast.error(ctx.error.message);
            } else {
              toast.error("Sign-in failed");
            }
          },
        },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sign-in failed");
    }
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
            <Tabs
              defaultValue="intern"
              onValueChange={handleTabChange}
              className="w-full"
            >
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

              {/* Intern Form */}
              <TabsContent value="intern">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input type="hidden" {...register("role")} value="INTERN" />
                  <div className="space-y-2">
                    <Label htmlFor="intern-email">Email</Label>
                    <Input
                      id="intern-email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intern-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="intern-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in as Intern"}
                  </Button>
                </form>
              </TabsContent>

              {/* Organization Form */}
              <TabsContent value="organization">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input
                    type="hidden"
                    {...register("role")}
                    value="ORGANIZATION"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Organization Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="Enter your organization email"
                      {...register("email", {
                        required: "Organization email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="org-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in as Organization"}
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
