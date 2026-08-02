"use client";

import { Plus, Search, SlidersHorizontal, Check } from "lucide-react";
import { useState } from "react";
import { InviteMemberModal } from "./InviteMemberModal";

// Role options used in the filter dropdown
const ROLE_OPTIONS = [
  { label: "All roles", value: "all"    },
  { label: "Owner",     value: "owner"  },
  { label: "Admin",     value: "admin"  },
  { label: "Member",    value: "member" },
  { label: "Guest",     value: "guest"  },
];

interface MembersHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterRole: string;
  onFilterChange: (val: string) => void;
}

export const MembersHeader = ({
  searchQuery,
  onSearchChange,
  filterRole,
  onFilterChange,
}: MembersHeaderProps) => {
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeLabel = ROLE_OPTIONS.find((o) => o.value === filterRole)?.label ?? "Filters";
  const isFiltered  = filterRole !== "all";

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* ── Top row: Title + Invite CTA ────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Members</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage who has access to this workspace.
          </p>
        </div>

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
          Invite Member
        </button>
      </div>

      {/* ── Bottom row: Search + Filters — matches ProjectHeader toolbar ─ */}
      <div className="flex items-center gap-3">
        {/* Search — inline pattern from ProjectHeader */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-56 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
          />
        </div>

        {/* Filters dropdown — same isMenuOpen pattern as ProjectCard / CycleCard */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className={`
              flex items-center gap-1.5 rounded-md border px-3 py-1.5
              text-sm transition-colors
              ${isFiltered
                ? "border-[#3f76ff] bg-[#3f76ff]/5 text-[#3f76ff]"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"}
            `}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {isFiltered ? activeLabel : "Filters"}
          </button>

          {isFilterOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onFilterChange(option.value);
                    setIsFilterOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {option.label}
                  {filterRole === option.value && (
                    <Check className="h-3.5 w-3.5 text-[#3f76ff]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear filter — only visible when a role is active */}
        {isFiltered && (
          <button
            onClick={() => onFilterChange("all")}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <InviteMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
