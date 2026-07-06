"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectInput, projectSchema } from "@/lib/validations/onboarding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function CreateProject({ onNext, onSkip }: { onNext: (data: ProjectInput) => void, onSkip: () => void }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });

  const name = watch("name");

  // Auto-generate identifier from project name (uppercase, max 5 chars)
  useEffect(() => {
    if (name) {
      const generated = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5);
      setValue("identifier", generated, { shouldValidate: true });
    }
  }, [name, setValue]);

  return (
    <div className="w-full flex flex-col max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
        Create your first project
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        Projects are where you group issues, cycles, and modules.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Project Name</Label>
          <Input id="name" placeholder="e.g. Website Redesign" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Identifier</Label>
          <Input id="identifier" placeholder="WEB" {...register("identifier")} maxLength={5} className="uppercase font-mono" />
          <p className="text-[11px] text-zinc-500">Used as a prefix for issues (e.g. WEB-123)</p>
          {errors.identifier && <p className="text-xs text-red-500">{errors.identifier.message}</p>}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="button" variant="ghost" onClick={onSkip} className="flex-1 h-11 text-zinc-500">
            Skip for now
          </Button>
          <Button type="submit" className="flex-1 h-11 bg-[#005a9e] hover:bg-[#004a82] text-white">
            Get Started
          </Button>
        </div>
      </form>
    </div>
  );
}
