"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceSetup } from "@/components/onboarding/workspace-setup";
import { InviteMembers } from "@/components/onboarding/invite-members";
import { CreateProject } from "@/components/onboarding/create-project";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = (data?: any) => {
    console.log(`Step ${step} Data:`, data);
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/");
    }
  };

  const handleSkip = () => {
    console.log(`Step ${step} Skipped`);
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-12">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${
              step >= i ? "bg-blue-600 dark:bg-blue-500" : "bg-zinc-200 dark:bg-zinc-800"
            }`} 
          />
        ))}
      </div>

      <div className="w-full relative overflow-hidden">
        {step === 1 && <WorkspaceSetup onNext={handleNext} onSkip={handleSkip} />}
        {step === 2 && <InviteMembers onNext={handleNext} onSkip={handleSkip} />}
        {step === 3 && <CreateProject onNext={handleNext} onSkip={handleSkip} />}
      </div>
    </div>
  );
}
