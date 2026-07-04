import { MoreHorizontal, CalendarDays } from "lucide-react";
import { Issue, mockUsers, mockModules, mockCycles } from "@/mocks/db";
import { IssueStatusBadge } from "./IssueStatusBadge";
import { IssuePriorityBadge } from "./IssuePriorityBadge";

type IssueRowProps = {
  issue: Issue;
};

// Placeholder display label for label badge (no label field in mock)
const LABEL_PLACEHOLDER = "UI";

export const IssueRow = ({ issue }: IssueRowProps) => {
  const assignee = mockUsers.find((u) => u.id === issue.assignee_id) ?? null;
  const module   = mockModules.find((m) => m.id === issue.module_id) ?? null;
  const cycle    = mockCycles.find((c) => c.id === issue.cycle_id) ?? null;

  // Derive initials for avatar fallback
  const initials = assignee
    ? assignee.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "–";

  return (
    <div
      className="
        group
        flex items-center gap-3
        border-b border-gray-100
        px-4 py-2.5
        hover:bg-gray-50
        transition-colors
        cursor-pointer
      "
    >
      {/* ── Priority icon (left edge) ───────────────────────────── */}
      <div className="w-20 shrink-0">
        <IssuePriorityBadge priority={issue.priority} />
      </div>

      {/* ── Issue ID ──────────────────────────────────────────────── */}
      <span className="w-14 shrink-0 text-xs font-mono text-gray-400 select-none">
        {issue.id}
      </span>

      {/* ── State badge ───────────────────────────────────────────── */}
      <div className="w-28 shrink-0">
        <IssueStatusBadge state={issue.state} />
      </div>

      {/* ── Title (flexible) ──────────────────────────────────────── */}
      <span className="flex-1 truncate text-sm text-gray-800 font-medium group-hover:text-gray-900">
        {issue.title}
      </span>

      {/* ── Module badge ──────────────────────────────────────────── */}
      {module ? (
        <span className="shrink-0 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600 whitespace-nowrap">
          {module.name}
        </span>
      ) : (
        <span className="w-24 shrink-0" />
      )}

      {/* ── Cycle badge ───────────────────────────────────────────── */}
      {cycle ? (
        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 whitespace-nowrap">
          {cycle.name.split(":")[0].trim()}
        </span>
      ) : (
        <span className="w-16 shrink-0" />
      )}

      {/* ── Label badge (placeholder) ─────────────────────────────── */}
      <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600">
        {LABEL_PLACEHOLDER}
      </span>

      {/* ── Due date (placeholder) ────────────────────────────────── */}
      <div className="flex w-24 shrink-0 items-center gap-1 text-[11px] text-gray-400">
        <CalendarDays className="h-3 w-3 shrink-0" />
        <span>Jul 12, 2026</span>
      </div>

      {/* ── Assignee avatar ───────────────────────────────────────── */}
      <div className="shrink-0" title={assignee?.name ?? "Unassigned"}>
        {assignee ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assignee.avatar}
            alt={assignee.name}
            className="h-[22px] w-[22px] rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gray-200 text-[9px] font-semibold text-gray-500">
            {initials}
          </div>
        )}
      </div>

      {/* ── More menu (static) ────────────────────────────────────── */}
      <button
        className="
          shrink-0 rounded p-1
          text-gray-300
          opacity-0 group-hover:opacity-100
          hover:bg-gray-200 hover:text-gray-600
          transition-all
        "
        aria-label="More options"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
