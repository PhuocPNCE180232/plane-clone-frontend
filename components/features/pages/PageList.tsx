"use client";

import { Loader2, FileText } from "lucide-react";
import { usePages } from "@/hooks/use-pages";
import { PageRow } from "./PageRow";

interface PageListProps {
  projectId: string;
  workspaceSlug: string;
  searchQuery?: string;
}

export const PageList = ({
  projectId,
  workspaceSlug,
  searchQuery = "",
}: PageListProps) => {
  const { data: pages, isLoading } = usePages(projectId || null);

  // ── Loading ───────────────────────────────────────────────────────────────
  // Same centered Loader2 pattern as MemberTable / ProjectList.
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Empty state (no pages in this project at all) ─────────────────────────
  // Inline pattern matching MemberTable empty state structure.
  if (!pages || pages.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <FileText className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="mb-1 text-sm font-semibold text-gray-700">
            No pages yet
          </h2>
          <p className="max-w-xs text-xs leading-relaxed text-gray-400">
            Create your first page to capture ideas and document this project.
          </p>
        </div>
      </div>
    );
  }

  // ── Client-side search filtering ─────────────────────────────────────────
  // Matches ProjectList filter pattern: lowercase query, single pass over data.
  const lowerQuery = searchQuery.toLowerCase();
  const filtered   = pages.filter((page) =>
    !lowerQuery || page.name.toLowerCase().includes(lowerQuery)
  );

  // ── Empty state after filtering ───────────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-gray-400">No pages match your search.</p>
      </div>
    );
  }

  // ── List ──────────────────────────────────────────────────────────────────
  // Container + column header identical to MemberTable / IssueTable.
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Column header row */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-xl">
        {/* Icon column spacer */}
        <span className="w-5 shrink-0" />

        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Title
        </span>

        <span className="w-36 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Last edited
        </span>

        {/* ⋯ column spacer */}
        <span className="w-6 shrink-0" />
      </div>

      {/* Rows */}
      {filtered.map((page) => (
        <PageRow
          key={page.id}
          page={page}
          projectId={projectId}
          workspaceSlug={workspaceSlug}
        />
      ))}
    </div>
  );
};
