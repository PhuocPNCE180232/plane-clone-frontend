"use client";

import { Loader2, Users } from "lucide-react";
import { useMembers } from "@/hooks/use-members";
import { mockUsers } from "@/mocks/db";
import { MemberRow } from "./MemberRow";

interface MemberTableProps {
  searchQuery?: string;
  filterRole?: string;
}

export const MemberTable = ({
  searchQuery = "",
  filterRole  = "all",
}: MemberTableProps) => {
  const { data: members, isLoading } = useMembers();

  // ── Loading ─────────────────────────────────────────────────────────────
  // Same centered Loader2 pattern as ProjectList.
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Empty state (no workspace members at all) ────────────────────────────
  if (!members || members.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="mb-1 text-sm font-semibold text-gray-700">
            No members yet
          </h2>
          <p className="max-w-xs text-xs leading-relaxed text-gray-400">
            Invite your teammates to collaborate in this workspace.
          </p>
        </div>
      </div>
    );
  }

  // ── Client-side filtering — same pattern as ProjectList ──────────────────
  // 1. Filter by role when filterRole !== "all"
  // 2. Filter by search query against name (from mockUsers) and email
  const lowerQuery = searchQuery.toLowerCase();

  const filtered = members.filter((member) => {
    if (filterRole !== "all" && member.role !== filterRole) return false;
    if (!lowerQuery) return true;
    const user = mockUsers.find((u) => u.email === member.email);
    const name = (user?.name ?? "").toLowerCase();
    return name.includes(lowerQuery) || member.email.toLowerCase().includes(lowerQuery);
  });

  // ── Empty state after filtering ─────────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-gray-400">No members match your search.</p>
      </div>
    );
  }

  // ── Table ────────────────────────────────────────────────────────────────
  // Container + header row style identical to IssueTable.
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Column header row — bg-gray-50, text-[10px] uppercase, matches IssueTable */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-xl">
        {/* Avatar placeholder column */}
        <span className="w-8 shrink-0" />

        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Member
        </span>

        <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Role
        </span>

        <span className="w-28 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Joined
        </span>

        {/* ⋯ column spacer */}
        <span className="w-6 shrink-0" />
      </div>

      {/* Rows */}
      {filtered.map((member) => (
        <MemberRow key={member.id} member={member} />
      ))}
    </div>
  );
};
