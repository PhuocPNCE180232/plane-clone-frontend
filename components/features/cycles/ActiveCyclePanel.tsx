import {
  CalendarDays,
  Clock3,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react";
import { Cycle, Issue } from "@/mocks/db";
import { CycleStatusBadge } from "./CycleStatusBadge";

type ActiveCyclePanelProps = {
  cycle: Cycle;
  issues: Issue[];
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysLeft(endDate: string): number {
  const now = new Date();
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// Static priority items for the "Priority Issues" panel (UI only)
const priorityItems = [
  { id: "FE-1", label: "Bọc QueryClientProvider (TanStack Query)", priority: "High",  state: "Todo",        color: "bg-orange-500" },
  { id: "FE-2", label: "Dựng UI tĩnh – Form Login & Signup",        priority: "Medium", state: "In Progress", color: "bg-blue-500"   },
];

const stateIcon = (state: string) => {
  switch (state) {
    case "Done":        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />;
    case "In Progress": return <Timer        className="h-3.5 w-3.5 text-blue-500  shrink-0" />;
    case "Cancelled":   return <AlertCircle  className="h-3.5 w-3.5 text-red-400   shrink-0" />;
    default:            return <Circle       className="h-3.5 w-3.5 text-gray-400  shrink-0" />;
  }
};

export const ActiveCyclePanel = ({ cycle, issues }: ActiveCyclePanelProps) => {
  const total     = issues.length;
  const completed = issues.filter((i) => i.state === "Done").length;
  const inProg    = issues.filter((i) => i.state === "In Progress").length;
  const daysLeft  = getDaysLeft(cycle.end_date);

  // Segment widths (guard divide-by-zero)
  const completedPct  = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProg    / total) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* ── Header strip ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-start gap-3">
          {/* Cycle colour dot */}
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#3f76ff]/10">
            <Clock3 className="h-4 w-4 text-[#3f76ff]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">{cycle.name}</h2>
              <CycleStatusBadge startDate={cycle.start_date} endDate={cycle.end_date} />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>
                {formatDate(cycle.start_date)} &ndash; {formatDate(cycle.end_date)}
              </span>
              <span className="mx-1 text-gray-300">|</span>
              <Clock3 className="h-3.5 w-3.5 shrink-0" />
              <span>
                {daysLeft > 0
                  ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`
                  : daysLeft === 0
                  ? "Ends today"
                  : `Ended ${Math.abs(daysLeft)}d ago`}
              </span>
            </div>
          </div>
        </div>

        <button className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          View Cycle
        </button>
      </div>

      {/* ── Body: two-column layout ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">

        {/* LEFT — Progress + Burndown placeholder */}
        <div className="border-b border-gray-100 p-6 lg:border-b-0 lg:border-r">

          {/* Issue state counts */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { label: "Total Issues",     value: total,                     color: "text-gray-900"  },
              { label: "Completed",        value: completed,                  color: "text-green-600" },
              { label: "In Progress",      value: inProg,                     color: "text-blue-600"  },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="mt-0.5 text-[10px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Multi-segment progress bar */}
          <div className="mb-2">
            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
              <span>Work item progress</span>
              <span className="font-medium text-gray-900">{completedPct}% done</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${completedPct}%` }}
              />
              <div
                className="h-full bg-blue-400 transition-all duration-500"
                style={{ width: `${inProgressPct}%` }}
              />
            </div>
            {/* Legend */}
            <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-green-500" />Completed</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-blue-400"  />In Progress</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-gray-200" />Remaining</span>
            </div>
          </div>

          {/* Burndown chart — static placeholder */}
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <TrendingDown className="h-3.5 w-3.5" />
              Burndown Chart
            </div>
            <div className="relative flex h-32 w-full items-end justify-center overflow-hidden rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4">
              {/* Static SVG burndown line placeholder */}
              <svg viewBox="0 0 280 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[20, 40, 60].map((y) => (
                  <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                {/* Ideal burndown line (gray dashed) */}
                <line x1="10" y1="8" x2="270" y2="72" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Actual burndown line (blue) */}
                <polyline
                  points="10,8 50,20 90,28 130,38 160,50 200,55 240,62"
                  fill="none"
                  stroke="#3f76ff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Area fill */}
                <polygon
                  points="10,8 50,20 90,28 130,38 160,50 200,55 240,62 240,80 10,80"
                  fill="#3f76ff"
                  fillOpacity="0.07"
                />
              </svg>
              <p className="relative z-10 text-[10px] font-medium text-gray-400">Placeholder — no real data</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Priority issues panel */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Priority Issues
            </p>
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-600">
              {priorityItems.length} high priority
            </span>
          </div>

          <div className="space-y-2">
            {priorityItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:border-gray-200 hover:bg-white transition-colors cursor-pointer"
              >
                {stateIcon(item.state)}
                <span className="flex-1 truncate text-xs text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.color}`}
                    title={item.priority}
                  />
                  <span className="text-[10px] text-gray-400">{item.id}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty issues message if no issues in mock */}
          {issues.length === 0 && (
            <div className="mt-6 flex flex-col items-center justify-center text-center">
              <Circle className="mb-2 h-8 w-8 text-gray-200" />
              <p className="text-xs text-gray-400">No issues in this cycle yet.</p>
            </div>
          )}

          {/* Bottom: overall completion stat */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-[#3f76ff]/20 bg-[#3f76ff]/5 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Overall Completion</p>
              <p className="mt-0.5 text-lg font-bold text-[#3f76ff]">{completedPct}%</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-500">Issues closed</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {completed} / {total}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
