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

interface ListViewModeProps {
  issues: Issue[];
  projectMap: WorkspaceProjectMap;
  displayOptions: DisplayOptions;
}

export const ListViewMode = ({
  issues,
  projectMap,
  displayOptions,
}: ListViewModeProps) => {
  if (issues.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="grid grid-cols-[1.2fr_160px_130px_120px_120px] border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        <span>Work item</span>
        <span>Project</span>
        <span>State</span>
        <span>Priority</span>
        <span>Created</span>
      </div>

      {issues.map((issue) => {
        const project = projectMap.get(getIssueProjectId(issue));

        return (
          <div
            key={issue.id}
            className="grid grid-cols-[1.2fr_160px_130px_120px_120px] items-center border-b border-gray-100 px-3 py-2 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {issue.title}
              </p>
              <p className="text-xs text-gray-400">{issue.id}</p>
            </div>

            <span className="truncate text-xs text-gray-500">
              {displayOptions.showProject
                ? project?.name ?? "Unknown"
                : "-"}
            </span>

            <span className="text-xs text-gray-500">{issue.state}</span>

            <span className="text-xs text-gray-500">
              {displayOptions.showPriority ? issue.priority : "-"}
            </span>

            <span className="text-xs text-gray-400">
              {displayOptions.showCreatedDate
                ? formatDate(getIssueDate(issue))
                : "-"}
            </span>
          </div>
        );
      })}
    </div>
  );
};