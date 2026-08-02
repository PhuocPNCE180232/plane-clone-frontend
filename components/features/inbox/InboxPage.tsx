"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import { InboxHeader } from "./InboxHeader";
import { InboxList } from "./InboxList";

export const InboxPage = () => {
  const params            = useParams();
  const slug              = (params?.workspaceSlug as string) ?? "workspaceSlug";
  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId    = useAppStore((state) => state.activeWorkspaceId);
  const activeWorkspace      = workspaces?.find((w) => w.id === activeWorkspaceId);

  // searchQuery + activeTab state owned here — same pattern as MembersPage
  // owning searchQuery + filterRole and passing them to Header + Table.
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab,   setActiveTab]   = useState<"all" | "unread">("all");

  return (
    <>
      {/* Breadcrumb — same pattern as MembersPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${slug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Inbox</span>
      </div>

      <InboxHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <InboxList searchQuery={searchQuery} activeTab={activeTab} />
    </>
  );
};
