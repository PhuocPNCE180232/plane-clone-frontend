import type { Cycle } from "@/lib/services/cycle.service";
import type { Module } from "@/lib/services/module.service";
import type { Issue } from "@/types";

export type ChartItem = {
  label: string;
  count: number;
};

export const ISSUE_STATES: Issue["state"][] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
  "Cancelled",
];

export const ISSUE_PRIORITIES: Issue["priority"][] = [
  "Urgent",
  "High",
  "Medium",
  "Low",
  "None",
];

export const MODULE_STATUSES: NonNullable<Module["status"]>[] = [
  "Backlog",
  "Planned",
  "In Progress",
  "Paused",
  "Completed",
  "Cancelled",
];

export const getIssueProjectId = (issue: Issue) => {
  return issue.project_id || issue.projectId || "";
};

export const getIssueAssigneeId = (issue: Issue) => {
  return issue.assignee_id || issue.assigneeId || "";
};

export const getIssueDate = (issue: Issue) => {
  return issue.created_at || issue.createdAt || "";
};

export const getFormattedDate = (value?: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export const getCompletionLabel = (completed: number, total: number) => {
  if (total === 0) return "0%";

  return `${Math.round((completed / total) * 100)}%`;
};

export const getCycleStatus = (cycle: Cycle) => {
  const now = new Date();
  const startDate = new Date(cycle.start_date);
  const endDate = new Date(cycle.end_date);

  if ((cycle.progress ?? 0) >= 100) return "Completed";
  if (startDate > now) return "Upcoming";
  if (endDate < now) return "Completed";

  return "Current";
};