"use client";

import { Loader2, Bell } from "lucide-react";
import { useInbox } from "@/hooks/use-inbox";
import { InboxItem } from "./InboxItem";

interface InboxListProps {
  workspaceId?: string;
  searchQuery: string;
  activeTab: "all" | "unread";
}

export const InboxList = ({
  workspaceId,
  searchQuery,
  activeTab,
}: InboxListProps) => {
  const { data: notifications, isLoading } = useInbox(workspaceId);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── No notifications at all ──────────────────────────────────────────────
  if (!notifications || notifications.length === 0) {
    return <EmptyState />;
  }

  // ── Client-side filter ───────────────────────────────────────────────────
  // 1. Tab:    "unread" hides is_read === true items.
  // 2. Search: case-insensitive match on title, description, OR type.
  const lowerQuery = (searchQuery || "").trim().toLowerCase();

  const filtered = notifications.filter((n) => {
    if (!n) return false;
    if (activeTab === "unread" && n.is_read) return false;
    if (!lowerQuery) return true;

    const title = (n.title || "").toLowerCase();
    const description = (n.description || "").toLowerCase();
    const type = (n.type || "").toLowerCase();

    return (
      title.includes(lowerQuery) ||
      description.includes(lowerQuery) ||
      type.includes(lowerQuery)
    );
  });

  // ── Filtered empty ───────────────────────────────────────────────────────
  if (filtered.length === 0) {
    // Distinguish between: search returned nothing vs tab has no items.
    const message = searchQuery
      ? "No notifications match your search."
      : activeTab === "unread"
        ? "You're all caught up!"
        : "No notifications.";

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Bell className="mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    );
  }

  // ── List ─────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {filtered.map((n) => (
        <InboxItem key={n.id} notification={n} />
      ))}
    </div>
  );
};

// ── Empty state — zero notifications in the system ───────────────────────────

const EmptyState = () => (
  <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white shadow-sm">
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Bell className="h-7 w-7 text-gray-400" />
      </div>
      <h2 className="mb-1 text-sm font-semibold text-gray-700">
        No notifications
      </h2>
      <p className="max-w-xs text-xs leading-relaxed text-gray-400">
        You&apos;re all caught up.
      </p>
    </div>
  </div>
);
