"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordInput, forgotPasswordSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");

  const onSubmit = async (data: ForgotPasswordInput) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Forgot Password Data:", data);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Forgot password?
        </h1>
        <h2 className="text-xl font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
          We&apos;ll send a reset link to your email.
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
        
        <Button type="submit" className="w-full mt-4 h-11 bg-[#005a9e] hover:bg-[#004a82] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Sending reset link..." : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}
