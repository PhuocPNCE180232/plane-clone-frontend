import {
  Activity,
  BarChart2,
  Boxes,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Module } from "@/lib/services/module.service";
import type { Project } from "@/types";

import { getFormattedDate } from "../analytics.helpers";

interface ModulesAnalyticsTabProps {
  modules: Module[];
  projects: Project[];
}

export const ModulesAnalyticsTab = ({
  modules,
  projects,
}: ModulesAnalyticsTabProps) => {
  const projectMap = new Map(
    projects.map((project) => [project.id, project]),
  );

  const moduleRows = modules.map((module) => ({
    module,
    status: module.status ?? "Backlog",
  }));

  const completedModules = moduleRows.filter(
    (row) => row.status === "Completed",
  );

  const inProgressModules = moduleRows.filter(
    (row) => row.status === "In Progress",
  );

  const plannedModules = moduleRows.filter(
    (row) => row.status === "Planned",
  );

  const pausedModules = moduleRows.filter(
    (row) => row.status === "Paused",
  );

  const progressStats = moduleRows.map((row) => ({
    label: row.module.name,
    count: row.module.progress ?? 0,
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
            label: "Completed Modules",
            value: completedModules.length,
            helper: "Completed modules",
          },
          {
            icon: <Activity className="h-4 w-4" />,
            label: "In progress Modules",
            value: inProgressModules.length,
            helper: "Currently active",
          },
          {
            icon: <CalendarDays className="h-4 w-4" />,
            label: "Planned Modules",
            value: plannedModules.length,
            helper: "Planned modules",
          },
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: "Paused Modules",
            value: pausedModules.length,
            helper: "Paused modules",
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
                row.status,
                project?.name ?? row.module.project_id,
                getFormattedDate(row.module.start_date),
                getFormattedDate(row.module.end_date),
                `${row.module.progress ?? 0}%`,
              ],
            };
          })}
          emptyLabel="No module data available."
        />
      </section>
    </div>
  );
};