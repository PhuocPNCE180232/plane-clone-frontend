"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInput, signUpSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, X } from "lucide-react";

import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const emailValue = watch("email");
  const nameValue = watch("name");

  const onSubmit = async (data: SignUpInput) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Sign Up Data:", data);

    // Set a mock cookie for middleware and redirect to onboarding
    document.cookie = "plane_session=true; path=/;";
    router.push("/onboarding");
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Work in all dimensions.
        </h1>
        <h2 className="text-xl font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
          Sign up for Plane.
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Full Name</Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              disabled={isSubmitting}
              className="pr-10"
            />
            {nameValue && (
              <button
                type="button"
                onClick={() => setValue("name", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              disabled={isSubmitting}
              className="pr-10"
            />
            {emailValue && (
              <button
                type="button"
                onClick={() => setValue("email", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("password")}
              disabled={isSubmitting}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full mt-4 h-11 bg-[#005a9e] hover:bg-[#004a82] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-zinc-500 mt-6 px-4">
          By signing up, you understand and agree to our{" "}
          <Link href="#" className="underline hover:text-zinc-800 dark:hover:text-zinc-300">Terms of Service</Link> and{" "}
          <Link href="#" className="underline hover:text-zinc-800 dark:hover:text-zinc-300">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
