"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import { PagesHeader } from "./PagesHeader";
import { PageList } from "./PageList";

export const PagesPage = () => {
  const params = useParams();
  const slug       = (params?.workspaceSlug as string) ?? "";
  const projectId  = (params?.projectId     as string) ?? "";

  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId    = useAppStore((state) => state.activeWorkspaceId);
  const activeWorkspace      = workspaces?.find((w) => w.id === activeWorkspaceId);

  // searchQuery owned here — same pattern as MembersPage owning searchQuery
  // and passing it to MembersHeader + MemberTable.
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Breadcrumb — three levels because pages are project-scoped.
          Pattern matches MembersPage / ProjectPage / IssuePage. */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${slug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <Link
          href={`/${slug}/projects`}
          className="transition-colors hover:text-gray-900"
        >
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Pages</span>
      </div>

      <PagesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <PageList
        projectId={projectId}
        workspaceSlug={slug}
        searchQuery={searchQuery}
      />
    </>
  );
};
