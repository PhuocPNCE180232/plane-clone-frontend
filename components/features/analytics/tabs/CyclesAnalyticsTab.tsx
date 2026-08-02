import {
  Activity,
  BarChart2,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Cycle } from "@/lib/services/cycle.service";
import { getIssueProgress } from "@/lib/issue-progress";
import type { Issue, Project } from "@/types";

import {
  getCycleStatus,
  getFormattedDate,
} from "../analytics.helpers";

interface CyclesAnalyticsTabProps {
  cycles: Cycle[];
  projects: Project[];
  issues: Issue[];
}

export const CyclesAnalyticsTab = ({
  cycles,
  projects,
  issues,
}: CyclesAnalyticsTabProps) => {
  const projectMap = new Map(
    projects.map((project) => [project.id, project]),
  );

  const cycleRows = cycles.map((cycle) => {
    const progress = getIssueProgress(
      issues.filter((issue) => issue.cycle_id === cycle.id),
    ).percent;

    return {
      cycle,
      status: getCycleStatus(cycle, progress),
      progress,
    };
  });

  const currentCycles = cycleRows.filter(
    (row) => row.status === "Current",
  );

  const upcomingCycles = cycleRows.filter(
    (row) => row.status === "Upcoming",
  );

  const completedCycles = cycleRows.filter(
    (row) => row.status === "Completed",
  );

  const progressStats = cycleRows.map((row) => ({
    label: row.cycle.name,
    count: row.progress,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Cycles</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: "Total Cycles",
            value: cycles.length,
            helper: "All workspace cycles",
          },
          {
            icon: <Activity className="h-4 w-4" />,
            label: "Current Cycles",
            value: currentCycles.length,
            helper: "Currently running",
          },
          {
            icon: <CalendarDays className="h-4 w-4" />,
            label: "Upcoming Cycles",
            value: upcomingCycles.length,
            helper: "Starts later",
          },
          {
            icon: <ShieldCheck className="h-4 w-4" />,
            label: "Completed Cycles",
            value: completedCycles.length,
            helper: "Progress complete",
          },
        ]}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsSectionTitle
          icon={<BarChart2 className="h-4 w-4" />}
          title="Cycle Progress"
        />

        <AnalyticsSimpleBarChart
          items={progressStats}
          axisLabel="Completion %"
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsDataTable
          columns={[
            "Cycle Name",
            "Status",
            "Project",
            "Start date",
            "End date",
            "Completion %",
          ]}
          rows={cycleRows.map((row) => {
            const project = projectMap.get(row.cycle.project_id);

            return {
              id: row.cycle.id,
              cells: [
                row.cycle.name,
                row.status,
                project?.name ?? row.cycle.project_id,
                getFormattedDate(row.cycle.start_date),
                getFormattedDate(row.cycle.end_date),
                `${row.progress}%`,
              ],
            };
          })}
          emptyLabel="No cycle data available."
        />
      </section>
    </div>
  );
};
