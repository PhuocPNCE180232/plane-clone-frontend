import {
  BarChart2,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { AnalyticsDataTable } from "../AnalyticsDataTable";
import { AnalyticsMetricGrid } from "../AnalyticsMetricCard";
import { AnalyticsSectionTitle } from "../AnalyticsSectionTitle";
import { AnalyticsSimpleBarChart } from "../AnalyticsSimpleBarChart";

import type { Issue } from "@/types";

import { getIssueAssigneeId } from "../analytics.helpers";

interface UsersAnalyticsTabProps {
  issues: Issue[];
  memberCount: number;
  uniqueAssigneeIds: string[];
}

export const UsersAnalyticsTab = ({
  issues,
  memberCount,
  uniqueAssigneeIds,
}: UsersAnalyticsTabProps) => {
  const users =
    uniqueAssigneeIds.length > 0
      ? uniqueAssigneeIds.map((id) => ({
          id,
          name: id,
          started: issues.filter(
            (issue) =>
              getIssueAssigneeId(issue) === id &&
              issue.state !== "Backlog" &&
              issue.state !== "Cancelled",
          ).length,
          unstarted: issues.filter(
            (issue) =>
              getIssueAssigneeId(issue) === id &&
              issue.state === "Backlog",
          ).length,
          completed: issues.filter(
            (issue) =>
              getIssueAssigneeId(issue) === id &&
              issue.state === "Done",
          ).length,
        }))
      : [
          {
            id: "current-user",
            name: "Current user",
            started: 0,
            unstarted: 0,
            completed: 0,
          },
        ];

  const resolvedPending = [
    {
      label: "Pending",
      count: issues.filter((issue) => issue.state !== "Done").length,
    },
    {
      label: "Resolved",
      count: issues.filter((issue) => issue.state === "Done").length,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Users</h2>

      <AnalyticsMetricGrid
        items={[
          {
            icon: <Users className="h-4 w-4" />,
            label: "Total Users",
            value: memberCount,
            helper: "Derived from workspace data",
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
            helper: "Pending members API",
          },
          {
            icon: <Users className="h-4 w-4" />,
            label: "Total Guests",
            value: 0,
            helper: "Pending guest data",
          },
        ]}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsSectionTitle
          icon={<BarChart2 className="h-4 w-4" />}
          title="Work items resolved vs pending"
        />

        <AnalyticsSimpleBarChart
          items={resolvedPending}
          axisLabel="Work items"
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <AnalyticsDataTable
          columns={[
            "Member Name",
            "Started",
            "Unstarted",
            "Completed",
          ]}
          rows={users.map((user) => ({
            id: user.id,
            cells: [
              user.name,
              user.started,
              user.unstarted,
              user.completed,
            ],
          }))}
          emptyLabel="No user data available."
        />
      </section>
    </div>
  );
};