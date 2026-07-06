import React from "react";
import Link from "next/link";
import { Plane } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0a0a]">
      <header className="p-6 flex items-center justify-between w-full border-b border-zinc-100 dark:border-zinc-800/50">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-zinc-900 dark:text-white" fill="currentColor" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Plane</span>
        </Link>
        <div className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
          admin@example.com
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 mt-8 mb-20">
        {children}
      </main>
    </div>
  );
}
