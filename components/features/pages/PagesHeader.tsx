"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { CreatePageModal } from "./CreatePageModal";

interface PagesHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const PagesHeader = ({ searchQuery, onSearchChange }: PagesHeaderProps) => {
  // isModalOpen state owned here — same pattern as MembersHeader owning
  // isModalOpen for InviteMemberModal.
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* ── Top row: Title + Add Page CTA ───────────────────────────────── */}
      {/* Same two-column layout as MembersHeader / ProjectHeader top row. */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pages</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Capture ideas and document this project.
          </p>
        </div>

        {/* Add Page button — wired in Phase 3. */}
        <button
          onClick={() => setIsModalOpen(true)}
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
          Add Page
        </button>
      </div>

      {/* ── Bottom row: Search ───────────────────────────────────────────── */}
      {/* Inline pattern copied from MembersHeader / ProjectHeader. */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-56 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
          />
        </div>
      </div>

      {/* Modal rendered at bottom of component — same placement as
          MembersHeader rendering InviteMemberModal. */}
      <CreatePageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
