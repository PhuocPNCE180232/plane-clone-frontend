import { CalendarDays, Circle, Flag } from "lucide-react";

import type { Issue } from "@/types";

import { EmptyState } from "../EmptyState";

import type { DisplayOptions, WorkspaceProjectMap } from "../types";

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

const stateProgress: Record<Issue["state"], number> = {
  Backlog: 15,
  Todo: 30,
  "In Progress": 60,
  Done: 100,
  Cancelled: 0,
};

const getTimestamp = (issue: Issue) => {
  const timestamp = new Date(getIssueDate(issue)).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const TimelineViewMode = ({
  issues,
  projectMap,
  displayOptions,
}: TimelineViewModeProps) => {
  if (issues.length === 0) {
    return <EmptyState />;
  }

  const sortedIssues = [...issues].sort(
    (firstIssue, secondIssue) =>
      getTimestamp(secondIssue) - getTimestamp(firstIssue),
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Timeline progress
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Timeline is based on each work item&apos;s created date and
              current state.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-50 px-2 py-1">
              Backlog 15%
            </span>
            <span className="rounded-full bg-gray-50 px-2 py-1">Todo 30%</span>
            <span className="rounded-full bg-gray-50 px-2 py-1">
              In Progress 60%
            </span>
            <span className="rounded-full bg-gray-50 px-2 py-1">Done 100%</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="min-w-215">
          <div className="grid grid-cols-[minmax(280px,1.3fr)_150px_minmax(320px,1fr)_160px] border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <span>Work item</span>
            <span>Created</span>
            <span>Timeline</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-gray-100">
            {sortedIssues.map((issue) => {
              const project = projectMap.get(getIssueProjectId(issue));
              const progress = stateProgress[issue.state];

              return (
                <article
                  key={issue.id}
                  className="grid grid-cols-[minmax(280px,1.3fr)_150px_minmax(320px,1fr)_160px] items-center gap-4 px-4 py-4 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <Circle className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-400" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {issue.title}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          <span>{issue.id}</span>

                          {displayOptions.showProject && (
                            <>
                              <span>•</span>
                              <span>{project?.name ?? "Unknown project"}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                    {displayOptions.showCreatedDate
                      ? formatDate(getIssueDate(issue))
                      : "-"}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">
                        {issue.state}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#3f76ff]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <span className="rounded-full bg-[#3f76ff]/10 px-2.5 py-1 text-xs font-medium text-[#3f76ff]">
                      {issue.state}
                    </span>

                    {displayOptions.showPriority && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Flag className="h-3.5 w-3.5" />
                        {issue.priority}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};