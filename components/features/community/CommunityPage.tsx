"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityList } from "./CommunityList";

type CommunityPageProps = {
  workspaceSlug: string;
};

export const CommunityPage = ({ workspaceSlug }: CommunityPageProps) => {
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((item) => item.slug === workspaceSlug);
  const workspaceId = workspace?.id;

  return (
    <>
      {/* Breadcrumb — same pattern as InboxPage / MembersPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${workspaceSlug}`}
          className="transition-colors hover:text-gray-900"
        >
          {workspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Community</span>
      </div>

      <CommunityHeader workspaceId={workspaceId} />
      <CommunityList workspaceId={workspaceId} />
    </>
  );
};
