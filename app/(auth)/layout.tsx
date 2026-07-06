import React from "react";
import Link from "next/link";
import { Plane } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-[#0a0a0a] sm:justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Plane className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Plane</span>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#111111] px-4 py-8 shadow-sm sm:rounded-xl sm:px-10 border border-zinc-200 dark:border-zinc-800/50">
          {children}
        </div>
      </div>
    </div>
  );
}
