import type { Issue } from "@/types";

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

export const getIssueDate = (issue: Issue) => {
  return issue.created_at || issue.createdAt || "";
};

export const getIssueProjectId = (issue: Issue) => {
  return issue.project_id || issue.projectId || "";
};

export const formatDate = (value?: string) => {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export const groupIssuesByDate = (issues: Issue[]) => {
  return issues.reduce<Record<string, Issue[]>>((result, issue) => {
    const key = getIssueDate(issue).split("T")[0] || "No date";

    return {
      ...result,
      [key]: [...(result[key] ?? []), issue],
    };
  }, {});
};