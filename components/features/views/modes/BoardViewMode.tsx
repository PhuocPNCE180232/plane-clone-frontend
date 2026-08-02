import Link from "next/link";
import { Circle } from "lucide-react";

import type { Issue } from "@/types";

import { EmptyState } from "../EmptyState";

import type { DisplayOptions, WorkspaceProjectMap } from "../types";

import {
  ISSUE_STATES,
  formatDate,
  getIssueDate,
  getIssueProjectId,
} from "../views.helpers";

interface BoardViewModeProps {
  issues: Issue[];
  projectMap: WorkspaceProjectMap;
  displayOptions: DisplayOptions;
  workspaceSlug: string;
}

export const BoardViewMode = ({
  issues,
  projectMap,
  displayOptions,
  workspaceSlug,
}: BoardViewModeProps) => {
  if (issues.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {ISSUE_STATES.map((state) => {
          const stateIssues = issues.filter((issue) => issue.state === state);

          return (
            <section
              key={state}
              className="w-72 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Circle className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                  <p className="truncate text-sm font-semibold text-gray-800">
                    {state}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-400">
                  {stateIssues.length}
                </span>
              </div>

              <div className="min-h-[420px] space-y-3 p-3">
                {stateIssues.map((issue) => {
                  const project = projectMap.get(getIssueProjectId(issue));

                  return (
                    <Link
                      key={issue.id}
                      href={`/${workspaceSlug}/projects/${getIssueProjectId(issue)}/issues/${issue.id}`}
                      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#3f76ff]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f76ff]"
                    >
                      <p className="text-xs font-medium text-gray-400">
                        {issue.id}
                      </p>

                      <h3 className="mt-2 break-words text-sm font-medium leading-5 text-gray-900 group-hover:text-[#3f76ff]">
                        {issue.title}
                      </h3>

                      <div className="mt-4 space-y-1 text-xs text-gray-400">
                        {displayOptions.showProject && (
                          <p className="truncate">
                            {project?.identifier ?? "PRJ"}
                          </p>
                        )}

                        {displayOptions.showPriority && (
                          <p>{issue.priority}</p>
                        )}

                        {displayOptions.showCreatedDate && (
                          <p>{formatDate(getIssueDate(issue))}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
