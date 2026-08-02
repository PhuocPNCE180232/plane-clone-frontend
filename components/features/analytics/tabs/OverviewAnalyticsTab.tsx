import {
  Activity,
  BarChart2,
  CircleDot,
  FolderOpen,
  Inbox,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Cycle } from "@/lib/services/cycle.service";
import type { Module } from "@/lib/services/module.service";
import type { Issue, Project } from "@/types";

import { getCompletionLabel, getIssueProjectId } from "../analytics.helpers";

interface OverviewAnalyticsTabProps {
  projects: Project[];
  issues: Issue[];
  cycles: Cycle[];
  modules: Module[];
  memberCount: number;
}

export const OverviewAnalyticsTab = ({
  projects,
  issues,
  cycles,
  modules,
  memberCount,
}: OverviewAnalyticsTabProps) => {
  const activeProjects = projects;

  const completedIssues = issues.filter((issue) => issue.state === "Done");

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
      completed: projectIssues.filter((issue) => issue.state === "Done").length,
    };
  });

  const summaryStats = [
    { label: "Work items", count: issues.length },
    { label: "Cycles", count: cycles.length },
    { label: "Modules", count: modules.length },
    { label: "Intake", count: 0 },
    { label: "Members", count: memberCount },
    { label: "Pages", count: 0 },
    { label: "Views", count: 1 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Overview</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <Users className="h-4 w-4" />,
            label: "Total Users",
            value: memberCount,
            helper: "Workspace members",
          },
          {
            icon: <ShieldCheck className="h-4 w-4" />,
            label: "Total Admins",
            value: 1,
            helper: "Owner included",
          },
          {
            icon: <UserPlus className="h-4 w-4" />,
            label: "Total Members",
            value: Math.max(memberCount - 1, 0),
            helper: "Pending member roles",
          },
          {
            icon: <Users className="h-4 w-4" />,
            label: "Total Guests",
            value: 0,
            helper: "Pending guest data",
          },
          {
            icon: <FolderOpen className="h-4 w-4" />,
            label: "Total Projects",
            value: projects.length,
            helper: `${activeProjects.length} active`,
          },
          {
            icon: <CircleDot className="h-4 w-4" />,
            label: "Total Work items",
            value: issues.length,
            helper: `${completedIssues.length} completed`,
          },
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: "Total Cycles",
            value: cycles.length,
            helper: "Linked from cycles",
          },
          {
            icon: <Inbox className="h-4 w-4" />,
            label: "Total Intake",
            value: 0,
            helper: "Pending intake data",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <AnalyticsSectionTitle
            icon={<BarChart2 className="h-4 w-4" />}
            title="Project Insights"
          />

          <AnalyticsSimpleBarChart
            items={summaryStats}
            axisLabel="Workspace data"
          />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <AnalyticsSectionTitle
            icon={<Activity className="h-4 w-4" />}
            title="Summary of Projects"
          />

          <div className="space-y-3">
            {summaryStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm text-gray-500">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsSectionTitle
          icon={<FolderOpen className="h-4 w-4" />}
          title="Active Projects"
        />

        <AnalyticsDataTable
          columns={["Name", "Work items", "Cycles", "Modules", "Completion"]}
          rows={projectRows.map((row) => ({
            id: row.project.id,
            cells: [
              row.project.name,
              row.workItems,
              row.cycles,
              row.modules,
              getCompletionLabel(row.completed, row.workItems),
            ],
          }))}
          emptyLabel="No project data available."
          showToolbar={false}
        />
      </section>
    </div>
  );
};
