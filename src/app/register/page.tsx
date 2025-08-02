"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate, isPending, error } = api.auth.register.useMutation({
    onSuccess: (data) => {
      console.log("Registration success:", data);
      // Optional: Redirect or show success message
      router.push("/login"); // redirect to login or another page
    },
    onError: (err) => {
      console.error("Registration error:", err);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md"
      >
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Register
        </h2>

        {/* Email Field */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.email && (
            <span className="mt-1 text-sm text-red-500">Email is required</span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 text-sm text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.password && (
            <span className="mt-1 text-sm text-red-500">
              Password must be at least 6 characters
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
