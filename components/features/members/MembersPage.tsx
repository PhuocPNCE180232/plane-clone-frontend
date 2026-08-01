"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import { MembersHeader } from "./MembersHeader";
import { MemberTable } from "./MemberTable";

export const MembersPage = () => {
  const params            = useParams();
  const slug              = (params?.workspaceSlug as string) ?? "workspaceSlug";
  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId);

  const activeWorkspace = workspaces?.find((w) => w.id === activeWorkspaceId);

  // Search + filter state owned here — same pattern as ProjectPage owning
  // searchQuery + activeTab and passing them to ProjectHeader + ProjectList.
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole,  setFilterRole]  = useState("all");

  return (
    <>
      {/* Breadcrumb — same pattern as ProjectPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${slug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Members</span>
      </div>

      <MembersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterRole={filterRole}
        onFilterChange={setFilterRole}
      />
      <MemberTable searchQuery={searchQuery} filterRole={filterRole} />
    </>
  );
};
