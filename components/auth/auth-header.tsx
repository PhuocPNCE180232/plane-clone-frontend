"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname();
  
  const isSignIn = pathname === "/sign-in";
  
  return (
    <div className="flex items-center text-sm">
      {isSignIn ? (
        <>
          <span className="text-zinc-500 dark:text-zinc-400 mr-1">New to Plane?</span>
          <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500">Sign up</Link>
        </>
      ) : (
        <>
          <span className="text-zinc-500 dark:text-zinc-400 mr-1">Already have an account?</span>
          <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500">Sign in</Link>
        </>
      )}
    </div>
  );
}
