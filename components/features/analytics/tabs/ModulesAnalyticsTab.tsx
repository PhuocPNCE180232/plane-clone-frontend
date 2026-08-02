import {
  BarChart2,
  Boxes,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Module } from "@/lib/services/module.service";
import { getIssueProgress } from "@/lib/issue-progress";
import {
  getModuleLifecycleLabel,
  getModuleLifecycleStatus,
} from "@/lib/module-lifecycle";
import type { Issue, Project } from "@/types";

import { getFormattedDate } from "../analytics.helpers";

interface ModulesAnalyticsTabProps {
  modules: Module[];
  projects: Project[];
  issues: Issue[];
}

export const ModulesAnalyticsTab = ({
  modules,
  projects,
  issues,
}: ModulesAnalyticsTabProps) => {
  const projectMap = new Map(
    projects.map((project) => [project.id, project]),
  );

  const moduleRows = modules.map((module) => {
    const progress = getIssueProgress(
      issues.filter((issue) => issue.module_id === module.id),
    );

    return {
      module,
      status: getModuleLifecycleStatus(module, progress),
      progress: progress.percent,
    };
  });

  const doneModules = moduleRows.filter((row) => row.status === "done");
  const upcomingModules = moduleRows.filter(
    (row) => row.status === "upcoming",
  );

  const progressStats = moduleRows.map((row) => ({
    label: row.module.name,
    count: row.progress,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Modules</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <Boxes className="h-4 w-4" />,
            label: "Total modules",
            value: modules.length,
            helper: "All workspace modules",
          },
          {
            icon: <ShieldCheck className="h-4 w-4" />,
            label: "Done Modules",
            value: doneModules.length,
            helper: "Completed work items or completed modules",
          },
          {
            icon: <CalendarDays className="h-4 w-4" />,
            label: "Upcoming Modules",
            value: upcomingModules.length,
            helper: "Modules with work still to complete",
          },
        ]}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsSectionTitle
          icon={<BarChart2 className="h-4 w-4" />}
          title="Module Progress"
        />

        <AnalyticsSimpleBarChart
          items={progressStats}
          axisLabel="Completion %"
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsDataTable
          columns={[
            "Module Name",
            "Status",
            "Project",
            "Start date",
            "End date",
            "Completion %",
          ]}
          rows={moduleRows.map((row) => {
            const project = projectMap.get(row.module.project_id);

            return {
              id: row.module.id,
              cells: [
                row.module.name,
                getModuleLifecycleLabel(row.status),
                project?.name ?? row.module.project_id,
                getFormattedDate(row.module.start_date),
                getFormattedDate(row.module.end_date),
                `${row.progress}%`,
              ],
            };
          })}
          emptyLabel="No module data available."
        />
      </section>
    </div>
  );
};
