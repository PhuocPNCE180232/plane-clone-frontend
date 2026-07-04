import { Layers } from "lucide-react";
import { mockIssues } from "@/mocks/db";
import { IssueRow } from "./IssueRow";

export const IssueTable = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* ── Column header bar ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Priority
        </span>
        <span className="w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          ID
        </span>
        <span className="w-28 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          State
        </span>
        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Title
        </span>
        <span className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Module
        </span>
        <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Cycle
        </span>
        <span className="w-8 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Label
        </span>
        <span className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Due Date
        </span>
        <span className="w-6 shrink-0" /> {/* Assignee */}
        <span className="w-6 shrink-0" /> {/* More menu */}
      </div>

      {/* ── Section label ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-2">
        <Layers className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-600">All Work Items</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          {mockIssues.length}
        </span>
      </div>

      {/* ── Issue rows ────────────────────────────────────────────── */}
      {mockIssues.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm font-medium text-gray-500">No work items yet</p>
          <p className="text-xs text-gray-400">
            Create your first issue to get started.
          </p>
        </div>
      ) : (
        mockIssues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))
      )}
    </div>
  );
};
