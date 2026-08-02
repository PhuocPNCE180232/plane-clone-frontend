import {
  Activity,
  BarChart2,
  CircleDot,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Cycle } from "@/lib/services/cycle.service";
import type { Module } from "@/lib/services/module.service";
import type { Issue, Project } from "@/types";

import {
  getCompletionLabel,
  getIssueProjectId,
} from "../analytics.helpers";

interface ProjectsAnalyticsTabProps {
  projects: Project[];
  issues: Issue[];
  cycles: Cycle[];
  modules: Module[];
}

export const ProjectsAnalyticsTab = ({
  projects,
  issues,
  cycles,
  modules,
}: ProjectsAnalyticsTabProps) => {
  const activeProjects = projects;

  const projectRows = projects.map((project) => {
    const projectIssues = issues.filter(
      (issue) => getIssueProjectId(issue) === project.id,
    );

    return {
      project,
      workItems: projectIssues.length,
      cycles: cycles.filter((cycle) => cycle.project_id === project.id).length,
      modules: modules.filter((module) => module.project_id === project.id)
        .length,
      completed: projectIssues.filter((issue) => issue.state === "Done")
        .length,
    };
  });

  const statusStats = [
    { label: "Active", count: activeProjects.length },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Projects</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <FolderOpen className="h-4 w-4" />,
            label: "Total Projects",
            value: projects.length,
            helper: "All workspace projects",
          },
          {
            icon: <Activity className="h-4 w-4" />,
            label: "On-track",
            value: activeProjects.length,
            helper: "Active projects",
          },
          {
            icon: <CircleDot className="h-4 w-4" />,
            label: "Off-track",
            value: 0,
            helper: "Pending project health data",
          },
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: "At risk",
            value: 0,
            helper: "Pending project health data",
          },
        ]}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsSectionTitle
          icon={<BarChart2 className="h-4 w-4" />}
          title="Projects by status"
        />

        <AnalyticsSimpleBarChart
          items={statusStats}
          axisLabel="Projects"
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsDataTable
          columns={[
            "Name",
            "Members",
            "Work items",
            "Cycles",
            "Modules",
            "Status",
            "Completion",
          ]}
          rows={projectRows.map((row) => ({
            id: row.project.id,
            cells: [
              row.project.name,
              1,
              row.workItems,
              row.cycles,
              row.modules,
              row.project.status ?? "active",
              getCompletionLabel(row.completed, row.workItems),
            ],
          }))}
          emptyLabel="No project data available."
        />
      </section>
    </div>
  );
};