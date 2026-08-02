import {
  Activity,
  BarChart2,
  CircleDot,
  Inbox,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Issue, Project } from "@/types";

import {
  ISSUE_PRIORITIES,
  ISSUE_STATES,
  getFormattedDate,
  getIssueDate,
  getIssueProjectId,
} from "../analytics.helpers";

interface WorkItemsAnalyticsTabProps {
  issues: Issue[];
  projects: Project[];
}

export const WorkItemsAnalyticsTab = ({
  issues,
  projects,
}: WorkItemsAnalyticsTabProps) => {
  const projectMap = new Map(
    projects.map((project) => [project.id, project]),
  );

  const startedIssues = issues.filter(
    (issue) => issue.state === "Todo" || issue.state === "In Progress",
  );

  const backlogIssues = issues.filter(
    (issue) => issue.state === "Backlog",
  );

  const unstartedIssues = issues.filter(
    (issue) => issue.state === "Backlog" || issue.state === "Cancelled",
  );

  const completedIssues = issues.filter(
    (issue) => issue.state === "Done",
  );

  const stateStats = ISSUE_STATES.map((state) => ({
    label: state,
    count: issues.filter((issue) => issue.state === state).length,
  }));

  const priorityStats = ISSUE_PRIORITIES.map((priority) => ({
    label: priority,
    count: issues.filter((issue) => issue.priority === priority).length,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Work items</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <CircleDot className="h-4 w-4" />,
            label: "Total Work items",
            value: issues.length,
            helper: "All workspace work items",
          },
          {
            icon: <Activity className="h-4 w-4" />,
            label: "Started Work items",
            value: startedIssues.length,
            helper: "Todo and in progress",
          },
          {
            icon: <Inbox className="h-4 w-4" />,
            label: "Backlog Work items",
            value: backlogIssues.length,
            helper: "Backlog items",
          },
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: "Unstarted Work items",
            value: unstartedIssues.length,
            helper: "Backlog or cancelled",
          },
          {
            icon: <ShieldCheck className="h-4 w-4" />,
            label: "Completed Work items",
            value: completedIssues.length,
            helper: "Done items",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <AnalyticsSectionTitle
            icon={<BarChart2 className="h-4 w-4" />}
            title="Work items by state"
          />

          <AnalyticsSimpleBarChart
            items={stateStats}
            axisLabel="States"
          />
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

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsDataTable
          columns={[
            "Work item",
            "Project",
            "State",
            "Priority",
            "Created",
          ]}
          rows={issues.map((issue) => {
            const project = projectMap.get(getIssueProjectId(issue));

            return {
              id: issue.id,
              cells: [
                issue.title,
                project?.name ?? "Unknown",
                issue.state,
                issue.priority,
                getFormattedDate(getIssueDate(issue)),
              ],
            };
          })}
          emptyLabel="No work item data available."
        />
      </section>
    </div>
  );
};