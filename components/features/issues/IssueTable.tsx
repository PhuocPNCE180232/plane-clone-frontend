"use client";

import { useEffect, useState } from "react";
import { Layers } from "lucide-react";

import { getIssues } from "@/lib/services/issue.service";
import type { Issue } from "@/types";

import { IssueRow } from "./IssueRow";

interface IssueTableProps {
  projectId: string;
}

export const IssueTable = ({
  projectId,
}: IssueTableProps) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getIssues(projectId);

        console.log(
          "🔥 NEW ISSUE TABLE RUNNING:",
          projectId,
          data
        );

        setIssues(data);
      } catch (error) {
        console.error("Failed to load issues:", error);

        setError("Failed to load work items");
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [projectId]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Column header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Priority
        </span>

        <span className="w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          ID
        </span>

        <span className="w-28 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          State
        </span>

        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Title
        </span>

        <span className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Module
        </span>

        <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Cycle
        </span>

        <span className="w-8 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Label
        </span>

        <span className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Due Date
        </span>

        {/* Assignee */}
        <span className="w-6 shrink-0" />

        {/* More */}
        <span className="w-6 shrink-0" />
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-2">
        <Layers className="h-3.5 w-3.5 text-gray-400" />

        <span className="text-xs font-semibold text-gray-600">
          All Work Items
        </span>

        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          {issues.length}
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          Loading work items...
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex h-32 items-center justify-center text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && issues.length === 0 && (
        <div className="flex h-32 flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm font-medium text-gray-500">
            No work items yet
          </p>

          <p className="text-xs text-gray-400">
            Create your first issue to get started.
          </p>
        </div>
      )}

      {/* Issues from API */}
      {!isLoading &&
        !error &&
        issues.map((issue) => (
          <IssueRow
            key={issue.id}
            issue={issue}
          />
        ))}
    </div>
  );
};