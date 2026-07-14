import { MoreHorizontal, CircleDot, Clock, CheckCircle2 } from "lucide-react";
import { Module, mockIssues } from "@/mocks/db";

type ModuleCardProps = {
  module: Module;
};

// Deterministic accent colour per module name
const ACCENT_COLOURS = [
  { bg: "bg-violet-100", text: "text-violet-600", bar: "bg-violet-500" },
  { bg: "bg-sky-100",    text: "text-sky-600",    bar: "bg-sky-500"    },
  { bg: "bg-rose-100",   text: "text-rose-600",   bar: "bg-rose-500"   },
  { bg: "bg-amber-100",  text: "text-amber-600",  bar: "bg-amber-500"  },
  { bg: "bg-emerald-100",text: "text-emerald-600",bar: "bg-emerald-500"},
];

function accentFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return ACCENT_COLOURS[hash % ACCENT_COLOURS.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
  const accent = accentFor(module.name);

  // Derive counts from mockIssues — read-only, no backend
  const moduleIssues = mockIssues.filter((i) => i.module_id === module.id);
  const total        = moduleIssues.length;
  const completed    = moduleIssues.filter((i) => i.state === "Done").length;
  const inProgress   = moduleIssues.filter((i) => i.state === "In Progress").length;
  const progressPct  = module.progress ?? (total > 0 ? Math.round((completed / total) * 100) : 0);

  return (
    <div
      className="
        group relative flex flex-col
        rounded-xl border border-gray-200 bg-white
        p-4 shadow-sm
        cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
        transition-all duration-200
      "
    >
      {/* ── Top row: icon + title + ••• menu ──────────────────────── */}
      <div className="mb-2 flex items-center gap-2.5">
        {/* Identifier avatar — smaller, inline */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tracking-wide ${accent.bg} ${accent.text}`}
        >
          {initials(module.name)}
        </div>

        {/* Title */}
        <h3 className="flex-1 truncate text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#3f76ff] transition-colors">
          {module.name}
        </h3>

        {/* ••• menu — always in DOM, visible on hover */}
        <button
          className="
            shrink-0 rounded p-1 text-gray-300
            opacity-0 group-hover:opacity-100
            hover:bg-gray-100 hover:text-gray-600
            transition-all
          "
          aria-label="More options"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Description ───────────────────────────────────────────── */}
      <p className="mb-3 text-[11px] leading-relaxed text-gray-400 line-clamp-2">
        {module.description}
      </p>

      {/* ── Progress ──────────────────────────────────────────────── */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Progress</span>
          <span className="text-[10px] font-semibold text-gray-600">{progressPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${accent.bar}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-2.5 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <CircleDot className="h-3 w-3 text-gray-400" />
          {total} {total === 1 ? "Issue" : "Issues"}
        </span>

        {inProgress > 0 && (
          <span className="flex items-center gap-1 text-orange-500">
            <CheckCircle2 className="h-3 w-3" />
            {inProgress} active
          </span>
        )}

        <span className="ml-auto flex items-center gap-1 text-gray-400">
          <Clock className="h-3 w-3" />
          2h ago
        </span>
      </div>
    </div>
  );
};
