"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityList } from "./CommunityList";

export const CommunityPage = () => {
  const params            = useParams();
  const slug              = (params?.workspaceSlug as string) ?? "workspaceSlug";
  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId    = useAppStore((state) => state.activeWorkspaceId);
  const activeWorkspace      = workspaces?.find((w) => w.id === activeWorkspaceId);

  return (
    <>
      {/* Breadcrumb — same pattern as InboxPage / MembersPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${slug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Community</span>
      </div>

      <CommunityHeader />
      <CommunityList />
    </>
  );
};
