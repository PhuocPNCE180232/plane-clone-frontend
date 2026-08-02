"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionList } from "./QuestionList";
import { CreateQuestionModal } from "./CreateQuestionModal";

export const QuestionPage = () => {
  const params            = useParams();
  const slug              = (params?.workspaceSlug as string) ?? "workspaceSlug";
  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId    = useAppStore((state) => state.activeWorkspaceId);
  const activeWorkspace      = workspaces?.find((w) => w.id === activeWorkspaceId);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Breadcrumb — same pattern as CommunityPage / MembersPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${slug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Questions</span>
      </div>

      <QuestionHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <QuestionList searchQuery={searchQuery} />

      <CreateQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
