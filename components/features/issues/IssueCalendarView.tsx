"use client";

import { CalendarDays } from "lucide-react";
import type { Issue } from "@/types";

interface IssueCalendarViewProps {
  issues: Issue[];
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export const IssueCalendarView = ({ issues }: IssueCalendarViewProps) => {
  const groupedIssues = issues.reduce<Record<string, Issue[]>>((acc, issue) => {
    const dateKey = issue.created_at.split("T")[0];

    acc[dateKey] = [...(acc[dateKey] ?? []), issue];

    return acc;
  }, {});

  const dates = Object.keys(groupedIssues).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  if (issues.length === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-center shadow-sm">
        <CalendarDays className="mb-2 h-7 w-7 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">No calendar items</p>
        <p className="text-xs text-gray-400">
          Issues will appear here by created date.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dates.map((date) => (
        <section
          key={date}
          className="rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">
              {formatDate(date)}
            </h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              {groupedIssues[date].length}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {groupedIssues[date].map((issue) => (
              <div key={issue.id} className="px-4 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {issue.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {issue.id} · {issue.state}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    {issue.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};