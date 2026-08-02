"use client";

import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Circle,
  Layers,
} from "lucide-react";
import type { Issue } from "@/types";

interface IssueAnalyticsViewProps {
  issues: Issue[];
}

const STATES: Issue["state"][] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
  "Cancelled",
];

const PRIORITIES: Issue["priority"][] = [
  "Urgent",
  "High",
  "Medium",
  "Low",
  "None",
];

export const IssueAnalyticsView = ({ issues }: IssueAnalyticsViewProps) => {
  const totalIssues = issues.length;

  const doneIssues = issues.filter((issue) => issue.state === "Done").length;

  const activeIssues = issues.filter(
    (issue) => issue.state === "Todo" || issue.state === "In Progress",
  ).length;

  const highPriorityIssues = issues.filter(
    (issue) => issue.priority === "Urgent" || issue.priority === "High",
  ).length;

  const stateStats = STATES.map((state) => ({
    label: state,
    count: issues.filter((issue) => issue.state === state).length,
  }));

  const priorityStats = PRIORITIES.map((priority) => ({
    label: priority,
    count: issues.filter((issue) => issue.priority === priority).length,
  }));

  const maxStateCount = Math.max(
    ...stateStats.map((item) => item.count),
    1,
  );

  const maxPriorityCount = Math.max(
    ...priorityStats.map((item) => item.count),
    1,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Layers className="mb-2 h-4 w-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-500">Total issues</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {totalIssues}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Circle className="mb-2 h-4 w-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-500">Active</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {activeIssues}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <CheckCircle2 className="mb-2 h-4 w-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-500">Done</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {doneIssues}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <AlertTriangle className="mb-2 h-4 w-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-500">High priority</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {highPriorityIssues}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-800">
              Issues by state
            </h3>
          </div>

          <div className="space-y-3">
            {stateStats.map((item) => {
              const width = (item.count / maxStateCount) * 100;

              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600">
                      {item.label}
                    </span>
                    <span className="text-gray-400">{item.count}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#3f76ff]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-800">
              Issues by priority
            </h3>
          </div>

          <div className="space-y-3">
            {priorityStats.map((item) => {
              const width = (item.count / maxPriorityCount) * 100;

              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600">
                      {item.label}
                    </span>
                    <span className="text-gray-400">{item.count}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-700"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};