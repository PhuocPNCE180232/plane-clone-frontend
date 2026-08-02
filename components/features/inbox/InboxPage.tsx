"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { InboxHeader } from "./InboxHeader";
import { InboxList } from "./InboxList";

type InboxPageProps = {
  workspaceSlug: string;
};

export const InboxPage = ({ workspaceSlug }: InboxPageProps) => {
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((item) => item.slug === workspaceSlug);
  const workspaceId = workspace?.id;

  // searchQuery + activeTab state owned here — same pattern as MembersPage
  // owning searchQuery + filterRole and passing them to Header + Table.
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab,   setActiveTab]   = useState<"all" | "unread">("all");

  return (
    <>
      {/* Breadcrumb — same pattern as MembersPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${workspaceSlug}`}
          className="transition-colors hover:text-gray-900"
        >
          {workspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Inbox</span>
      </div>

      <InboxHeader
        workspaceId={workspaceId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <InboxList
        workspaceId={workspaceId}
        searchQuery={searchQuery}
        activeTab={activeTab}
      />
    </>
  );
};
