"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteMembersInput, inviteMembersSchema } from "@/lib/validations/onboarding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export function InviteMembers({ onNext, onSkip }: { onNext: (data: InviteMembersInput) => void, onSkip: () => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<InviteMembersInput>({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: {
      emails: [{ email: "" }, { email: "" }, { email: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails"
  });

  return (
    <div className="w-full flex flex-col max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
        Invite your team
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        Plane is better with your team. Invite them to get started.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Email addresses</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input placeholder="name@example.com" {...register(`emails.${index}.email` as const)} />
                {errors.emails?.[index]?.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.emails[index]?.email?.message}</p>
                )}
              </div>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-zinc-400 hover:text-red-500 h-10 w-10 shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="link" onClick={() => append({ email: "" })} className="text-blue-600 px-0 h-auto font-medium">
            <Plus className="h-4 w-4 mr-1" /> Add another
          </Button>
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
