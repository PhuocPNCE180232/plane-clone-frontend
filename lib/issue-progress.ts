import type { Issue } from "@/types";

export type IssueProgress = {
  total: number;
  completed: number;
  inProgress: number;
  percent: number;
};

/**
 * Calculates completion from the current work items instead of a persisted
 * module/cycle percentage. Cancelled items remain in the total so this keeps
 * the same completion semantics that the UI used previously.
 */
export const getIssueProgress = (
  issues: readonly Issue[],
): IssueProgress => {
  const total = issues.length;
  const completed = issues.filter((issue) => issue.state === "Done").length;
  const inProgress = issues.filter(
    (issue) => issue.state === "In Progress",
  ).length;

  return {
    total,
    completed,
    inProgress,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
};
