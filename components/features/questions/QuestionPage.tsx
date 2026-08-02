"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionList } from "./QuestionList";
import { CreateQuestionModal } from "./CreateQuestionModal";

type QuestionPageProps = {
  workspaceSlug: string;
};

export const QuestionPage = ({ workspaceSlug }: QuestionPageProps) => {
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((item) => item.slug === workspaceSlug);
  const workspaceId = workspace?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Breadcrumb — same pattern as CommunityPage / MembersPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${workspaceSlug}`}
          className="transition-colors hover:text-gray-900"
        >
          {workspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Questions</span>
      </div>

      <QuestionHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <QuestionList workspaceId={workspaceId} searchQuery={searchQuery} />

      <CreateQuestionModal
        isOpen={isModalOpen}
        workspaceId={workspaceId}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
