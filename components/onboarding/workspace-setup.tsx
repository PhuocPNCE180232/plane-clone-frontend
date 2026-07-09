"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceInput, workspaceSchema } from "@/lib/validations/onboarding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function WorkspaceSetup({ onNext, onSkip }: { onNext: (data: WorkspaceInput) => void, onSkip: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
  });

  return (
    <div className="w-full flex flex-col max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
          Let's build your workspace
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your workspace is where your teams and projects live.
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Workspace Name</Label>
          <Input id="name" placeholder="e.g. Acme Corp" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Workspace URL</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-3 text-sm text-zinc-500 dark:text-zinc-400">
              plane.so/
            </span>
            <Input id="slug" placeholder="acme" {...register("slug")} className="rounded-l-none" />
          </div>
          {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companySize" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Company Size</Label>
          <select 
            id="companySize" 
            {...register("companySize")}
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
          >
            <option value="" disabled className="text-zinc-500 dark:text-zinc-400">Select company size</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
          {errors.companySize && <p className="text-xs text-red-500">{errors.companySize.message}</p>}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="button" variant="ghost" onClick={onSkip} className="flex-1 h-11 text-zinc-500">
            Skip for now
          </Button>
          <Button type="submit" className="flex-1 h-11 bg-[#005a9e] hover:bg-[#004a82] text-white">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
