"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInInput, signInSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, X } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const emailValue = watch("email");

  const onSubmit = async (data: SignInInput) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Sign In Data:", data);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Work in all dimensions.
        </h1>
        <h2 className="text-xl font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
          Welcome back to Plane.
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="pt-1">
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <Button type="submit" className="w-full mt-4 h-11 bg-[#005a9e] hover:bg-[#004a82] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Go to workspace"}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-zinc-500 mt-6 px-4">
          By signing in, you understand and agree to our{" "}
          <Link href="#" className="underline hover:text-zinc-800 dark:hover:text-zinc-300">Terms of Service</Link> and{" "}
          <Link href="#" className="underline hover:text-zinc-800 dark:hover:text-zinc-300">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
