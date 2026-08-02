import {
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

import { AnalyticsMetricGrid } from "@/components/features/analytics/AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "@/components/features/analytics/AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "@/components/features/analytics/AnalyticsSimpleBarChart";
import type { Issue } from "@/types";

const ISSUE_STATES: Issue["state"][] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
  "Cancelled",
];

const ISSUE_PRIORITIES: Issue["priority"][] = [
  "Urgent",
  "High",
  "Medium",
  "Low",
  "None",
];

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDueDateKey = (dueDate?: string | null) => {
  const match = dueDate?.match(/^(\d{4}-\d{2}-\d{2})/);

  return match?.[1] ?? null;
};

interface ProjectIssuesAnalyticsProps {
  issues: Issue[];
}

export const ProjectIssuesAnalytics = ({
  issues,
}: ProjectIssuesAnalyticsProps) => {
  const completedIssues = issues.filter((issue) => issue.state === "Done");
  const inProgressIssues = issues.filter(
    (issue) => issue.state === "In Progress",
  );
  const todayKey = getTodayKey();
  const overdueIssues = issues.filter((issue) => {
    const dueDateKey = getDueDateKey(issue.due_date);

    return (
      dueDateKey !== null &&
      dueDateKey < todayKey &&
      issue.state !== "Done" &&
      issue.state !== "Cancelled"
    );
  });

  const completionRate =
    issues.length === 0
      ? 0
      : Math.round((completedIssues.length / issues.length) * 100);

  const stateStats = ISSUE_STATES.map((state) => ({
    label: state,
    count: issues.filter((issue) => issue.state === state).length,
  }));

  const priorityStats = ISSUE_PRIORITIES.map((priority) => ({
    label: priority,
    count: issues.filter((issue) => issue.priority === priority).length,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Work item analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Live metrics calculated from this project&apos;s work items.
          </p>
        </div>
      </div>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <CircleDot className="h-4 w-4" />,
            label: "Total work items",
            value: issues.length,
            helper: "All work items in this project",
          },
          {
            icon: <CheckCircle2 className="h-4 w-4" />,
            label: "Completed",
            value: completedIssues.length,
            helper: `${completionRate}% completion rate`,
          },
          {
            icon: <Activity className="h-4 w-4" />,
            label: "In progress",
            value: inProgressIssues.length,
            helper: "Actively being worked on",
          },
          {
            icon: <AlertTriangle className="h-4 w-4" />,
            label: "Overdue",
            value: overdueIssues.length,
            helper: "Open work items past their due date",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <AnalyticsSectionTitle
            icon={<BarChart2 className="h-4 w-4" />}
            title="Work items by state"
          />
          <AnalyticsSimpleBarChart items={stateStats} axisLabel="State" />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <AnalyticsSectionTitle
            icon={<BarChart2 className="h-4 w-4" />}
            title="Work items by priority"
          />
          <AnalyticsSimpleBarChart
            items={priorityStats}
            axisLabel="Priority"
          />
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Needs attention
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Open work items past their due date
            </p>
          </div>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
            {overdueIssues.length}
          </span>
        </div>

        {overdueIssues.length === 0 ? (
          <p className="px-4 py-5 text-sm text-gray-400">
            No overdue work items.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {overdueIssues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {issue.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{issue.id}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-red-500">
                  Due {getDueDateKey(issue.due_date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
