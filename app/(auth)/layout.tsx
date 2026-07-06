import React from "react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/auth-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0a0a] relative">
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center w-full">
        <Link href="/" className="flex items-center gap-2">
          {/* Add custom logo here later */}
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Plane</span>
        </Link>
        <AuthHeader />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto px-4 mt-20">
        {children}
      </main>

      <footer className="w-full pb-8 flex flex-col items-center">
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
          Join 10,000+ teams building with Plane
        </p>
        <div className="flex items-center justify-center gap-8 opacity-70 grayscale">
          <span className="text-sm font-bold text-blue-600 tracking-tight">ZERODHA</span>
          <span className="text-sm font-bold tracking-tighter text-zinc-900 dark:text-zinc-100">SONY</span>
          <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dolby</span>
          <span className="text-sm font-bold tracking-tighter lowercase text-zinc-900 dark:text-zinc-100">accenture</span>
        </div>
      </footer>
    </div>
  );
}
