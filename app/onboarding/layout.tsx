import React from "react";
import Link from "next/link";
import { UserDropdown } from "@/components/auth/user-dropdown";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0a0a]">
      <header className="p-6 flex items-center justify-between w-full border-b border-zinc-100 dark:border-zinc-800/50">
        <Link href="/" className="flex items-center gap-2">
          {/* Add custom logo here later */}
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Plane</span>
        </Link>
        <UserDropdown />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 mt-8 mb-20">
        {children}
      </main>
    </div>
  );
}
