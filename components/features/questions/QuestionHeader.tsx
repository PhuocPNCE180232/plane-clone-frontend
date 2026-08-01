"use client";

import { Plus, Search } from "lucide-react";

interface QuestionHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenModal: () => void;
}

export const QuestionHeader = ({
  searchQuery,
  onSearchChange,
  onOpenModal,
}: QuestionHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* ── Top row: Title + Ask CTA ────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Questions</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Ask questions, get help, and share knowledge with your team.
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="
            flex items-center gap-1.5
            rounded-md bg-[#3f76ff]
            px-3 py-1.5
            text-xs font-medium text-white
            hover:bg-[#2d63e8]
            transition-colors
            shadow-sm
          "
        >
          <Plus className="h-3.5 w-3.5" />
          Ask Question
        </button>
      </div>

      {/* ── Toolbar: Search input ────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
          />
        </div>
      </div>
    </div>
  );
};
