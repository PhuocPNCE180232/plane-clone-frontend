"use client";

import { Search, CheckCheck } from "lucide-react";
import { useInbox, useMarkAllAsReadMutation } from "@/hooks/use-inbox";
import { toast } from "@/hooks/use-toast";

interface InboxHeaderProps {
  workspaceId?: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeTab: "all" | "unread";
  onTabChange: (tab: "all" | "unread") => void;
}

export const InboxHeader = ({
  workspaceId,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}: InboxHeaderProps) => {
  // React Query deduplicates this — InboxList already called useInbox(),
  // so this is a cache read, not a second network request.
  const { data: notifications } = useInbox(workspaceId);
  const { mutate: markAll, isPending } = useMarkAllAsReadMutation();

  // Disable "Mark all as read" when every notification is already read.
  const allAlreadyRead =
    !notifications ||
    notifications.length === 0 ||
    notifications.every((n) => n.is_read);

  const onMarkAll = () => {
    if (!workspaceId) return;

    markAll(workspaceId, {
      onSuccess: () => toast.success("All notifications marked as read."),
      onError:   () => toast.error("Failed to mark all as read."),
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* ── Top row: Title + Mark-all CTA ──────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Stay updated with project activity.
          </p>
        </div>

        {/* Disabled when all already read or request in flight —
            matches the Save button in PageDetail */}
        <button
          onClick={onMarkAll}
          disabled={allAlreadyRead || isPending}
          className="
            flex items-center gap-1.5
            rounded-md border border-gray-300
            px-3 py-1.5
            text-xs font-medium text-gray-600
            hover:border-gray-400 hover:bg-gray-50
            transition-colors
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all as read
        </button>
      </div>

      {/* ── Toolbar: Search + Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Search — same w-56 input as MembersHeader */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-56 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
          />
        </div>

        {/* Tabs: All / Unread — pill-style, same shape as other segmented controls */}
        <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-0.5">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`
                rounded px-3 py-1 text-xs font-medium capitalize transition-colors
                ${activeTab === tab
                  ? "bg-white text-[#3f76ff] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
