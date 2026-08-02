"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreatePostModal } from "./CreatePostModal";

type CommunityHeaderProps = {
  workspaceId?: string;
};

export const CommunityHeader = ({ workspaceId }: CommunityHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Community</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Discuss and share updates with your team.
        </p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        disabled={!workspaceId}
        className="
          flex items-center gap-1.5
          rounded-md bg-[#3f76ff]
          px-3 py-1.5
          text-xs font-medium text-white
          hover:bg-[#2d63e8]
          transition-colors
        "
      >
        <Plus className="h-3.5 w-3.5" />
        New Post
      </button>

      <CreatePostModal
        isOpen={isModalOpen}
        workspaceId={workspaceId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
