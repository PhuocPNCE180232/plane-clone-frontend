import type { Issue } from "@/types";

import { EmptyState } from "../EmptyState";

import type {
  DisplayOptions,
  WorkspaceProjectMap,
} from "../types";

import {
  formatDate,
  getIssueDate,
  getIssueProjectId,
} from "../views.helpers";

interface TimelineViewModeProps {
  issues: Issue[];
  projectMap: WorkspaceProjectMap;
  displayOptions: DisplayOptions;
}

const getProgressByState = (state: Issue["state"]) => {
  if (state === "Backlog") return 20;
  if (state === "Todo") return 35;
  if (state === "In Progress") return 65;
  if (state === "Done") return 100;

  return 10;
};

export const TimelineViewMode = ({
  issues,
  projectMap,
  displayOptions,
}: TimelineViewModeProps) => {
  if (issues.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const project = projectMap.get(getIssueProjectId(issue));
        const progress = getProgressByState(issue.state);

        return (
          <div
            key={issue.id}
            className="grid gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-[220px_1fr_120px]"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                {issue.title}
              </p>

              <p className="text-xs text-gray-400">
                {displayOptions.showProject
                  ? project?.name ?? "Unknown project"
                  : issue.state}
              </p>
            </div>

            <div className="flex items-center">
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-[#3f76ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              {displayOptions.showCreatedDate
                ? formatDate(getIssueDate(issue))
                : "-"}
            </p>
          </div>
        );
      })}
    </div>
  );
};