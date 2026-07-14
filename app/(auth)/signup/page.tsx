"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type SignupForm = {
  name: string;
  email: string;
  password?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: SignupForm) => {
    setErrorMsg("");
    try {
      await signup(data);
      router.push("/onboarding");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Create an account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your details below to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        {errorMsg && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
            {errorMsg}
          </div>
        )}
        
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            {...register("name", { required: "Name is required" })} 
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...register("email", { required: "Email is required" })} 
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            {...register("password")} 
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
