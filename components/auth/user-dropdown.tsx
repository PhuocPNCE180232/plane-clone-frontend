"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Lấy chữ cái đầu của email để làm avatar fallback
  const avatarLetter = user?.email?.charAt(0).toUpperCase() ?? "?";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/sign-in");
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-blue-600 text-white hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 dark:hover:ring-offset-[#0a0a0a] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0a0a0a]"
      >
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name ?? user.email}
            width={36}
            height={36}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="text-sm font-semibold">{avatarLetter}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-[#111111] shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 mb-1 flex items-center gap-3">
            {/* Mini avatar in dropdown */}
            <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name ?? ""}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-white">{avatarLetter}</span>
              )}
            </div>
            <div className="min-w-0">
              {user?.name && (
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors disabled:opacity-60"
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {isLoggingOut ? "Đang đăng xuất..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
