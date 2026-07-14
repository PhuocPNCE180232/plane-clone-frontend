import { CalendarDays, Clock3, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Cycle, Issue } from "@/mocks/db";
import { CycleProgressBar } from "./CycleProgressBar";
import { CycleStatusBadge } from "./CycleStatusBadge";

type CycleCardProps = {
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

export const CycleCard = ({ cycle, issues }: CycleCardProps) => {
  const totalIssues     = issues.length;
  const completedIssues = issues.filter((i) => i.state === "Done").length;
  const progressPercent = cycle.progress ?? (totalIssues > 0
    ? Math.round((completedIssues / totalIssues) * 100)
    : 0);
  const daysLeft = getDaysLeft(cycle.end_date);

  const daysLabel =
    daysLeft > 0
      ? `${daysLeft}d left`
      : daysLeft === 0
      ? "Ends today"
      : `Ended ${Math.abs(daysLeft)}d ago`;

  return (
    <Card
      className="
        group relative
        cursor-pointer
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
      "
    >
      {/* Three-dot menu (static) */}
      <button
        className="
          absolute right-4 top-4
          rounded p-1 text-gray-400
          opacity-0 group-hover:opacity-100
          hover:bg-gray-100 hover:text-gray-600
          transition-all
        "
        aria-label="More options"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {/* Top row: title + badge */}
      <div className="mb-2 flex items-start justify-between gap-2 pr-6">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#3f76ff] transition-colors">
          {cycle.name}
        </h3>
        <CycleStatusBadge startDate={cycle.start_date} endDate={cycle.end_date} />
      </div>

      {/* Date range */}
      <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        <span>
          {formatDate(cycle.start_date)}&nbsp;&ndash;&nbsp;{formatDate(cycle.end_date)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <CycleProgressBar percent={progressPercent} />
      </div>

      {/* Footer: issue count + days remaining */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {totalIssues === 0
            ? "No issues"
            : `${completedIssues} / ${totalIssues} issues`}
        </span>

        <span className="flex items-center gap-1 text-gray-400">
          <Clock3 className="h-3.5 w-3.5" />
          {daysLabel}
        </span>
      </div>
    </Card>
  );
};
