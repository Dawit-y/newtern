"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { api } from "@/trpc/react";
import { organizationSchema } from "@/lib/validation/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type OrgFormValues = z.infer<typeof organizationSchema>;

export default function OrganizationSignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrgFormValues>({
    resolver: zodResolver<OrgFormValues>(organizationSchema),
    defaultValues: {
      role: "ORGANIZATION",
      organizationName: "",
      contactFirstName: "",
      contactLastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
      industry: undefined,
      companySize: undefined,
      website: "",
      location: "",
      description: "",
      internshipGoals: "",
    },
  });

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Organization account created successfully!");
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSubmit: SubmitHandler<OrgFormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      console.log("password", data.password);
      console.log("confirmPassword", data.confirmPassword);
      toast.error("Passwords do not match");
      return;
    }
    await registerMutation.mutateAsync(data);
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <input type="hidden" {...register("role")} value="ORGANIZATION" />

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input id="organizationName" {...register("organizationName")} />
        {errors.organizationName && (
          <p className="text-sm text-red-500">
            {errors.organizationName.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactFirstName">Contact First Name</Label>
          <Input id="contactFirstName" {...register("contactFirstName")} />
          {errors.contactFirstName && (
            <p className="text-sm text-red-500">
              {errors.contactFirstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactLastName">Contact Last Name</Label>
          <Input id="contactLastName" {...register("contactLastName")} />
          {errors.contactLastName && (
            <p className="text-sm text-red-500">
              {errors.contactLastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Work Email Address</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input id="jobTitle" {...register("jobTitle")} />
        {errors.jobTitle && (
          <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
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
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select onValueChange={(val) => setValue("industry", val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="nonprofit">Non-profit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Company Size</Label>
          <Select onValueChange={(val) => setValue("companySize", val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-1000">201-1000 employees</SelectItem>
              <SelectItem value="1000+">1000+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Company Website</Label>
        <Input id="website" type="url" {...register("website")} />
        {errors.website && (
          <p className="text-sm text-red-500">{errors.website.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register("location")} />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          className="min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="internshipGoals">Internship Program Goals</Label>
        <Textarea
          id="internshipGoals"
          {...register("internshipGoals")}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !agreedToTerms}
      >
        {isSubmitting ? "Creating Account..." : "Create Organization Account"}
      </Button>
    </form>
  );
}
