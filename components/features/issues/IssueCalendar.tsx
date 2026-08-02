"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { EmptyState } from "@/components/features/views/EmptyState";
import {
  formatDate,
  groupIssuesByDate,
} from "@/components/features/views/views.helpers";
import type { Issue } from "@/types";

interface IssueCalendarProps {
  issues: Issue[];
}

export const IssueCalendar = ({ issues }: IssueCalendarProps) => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const issuesByDate = useMemo(() => groupIssuesByDate(issues), [issues]);
  const dates = Object.keys(issuesByDate).sort();

  if (dates.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {dates.map((date) => {
        const dayIssues = issuesByDate[date] ?? [];

        return (
          <div
            key={date}
            className="rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-800">
                {date === "No date" ? date : formatDate(date)}
              </p>
            </div>

            <div className="space-y-2">
              {dayIssues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/${workspaceSlug}/projects/${issue.project_id}/issues/${issue.id}`}
                  className="group block rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:border-[#3f76ff]/40 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f76ff]"
                >
                  <p className="text-sm font-medium text-gray-800 group-hover:text-[#3f76ff]">
                    {issue.title}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                    <span>{issue.id}</span>
                    <span>{issue.state}</span>
                    <span>{issue.priority}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
