import Link from "next/link";
import { CalendarDays, ChevronRight, Layers } from "lucide-react";
import type { AssignedWorkItem } from "@/hooks/use-assigned-work-items";
import { IssuePriorityBadge } from "@/components/features/issues/IssuePriorityBadge";
import { IssueStatusBadge } from "@/components/features/issues/IssueStatusBadge";

type YourWorkListProps = {
  workItems: AssignedWorkItem[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatDueDate = (dueDate?: string | null) =>
  dueDate ? dateFormatter.format(new Date(dueDate)) : "No due date";

export const YourWorkList = ({ workItems }: YourWorkListProps) => {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <Layers className="h-4 w-4 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-800">Assigned work items</h2>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          {workItems.length}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {workItems.map(({ issue, project, workspace }) => (
          <Link
            key={issue.id}
            href={`/${workspace.slug}/projects/${project.id}/issues/${issue.id}`}
            className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-mono text-xs text-gray-400">
                  {issue.id}
                </span>
                <h3 className="truncate text-sm font-semibold text-gray-800 group-hover:text-[#3f76ff]">
                  {issue.title}
                </h3>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                <span>{workspace.name}</span>
                <span className="text-gray-300">/</span>
                <span>{project.name}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:shrink-0">
              <IssuePriorityBadge priority={issue.priority} />
              <IssueStatusBadge state={issue.state} />
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDueDate(issue.due_date)}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
