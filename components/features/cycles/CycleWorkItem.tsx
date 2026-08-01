"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import IssueBoard from "@/components/features/issues/board/IssueBoard";
import { IssueHeader } from "@/components/features/issues/IssueHeader";
import { IssueToolbar } from "@/components/features/issues/IssueToolbar";
import { IssueTable } from "@/components/features/issues/IssueTable";
import { mockIssues, mockCycles } from "@/mocks/db";

interface CycleWorkItemProps {
  cycleId?: string;
}

export const CycleWorkItem = ({ cycleId }: CycleWorkItemProps) => {
  const [view, setView] = useState<"list" | "board">("list");
  const [reloadKey, setReloadKey] = useState(0);
  const params = useParams();

  const effectiveCycleId = cycleId ?? params?.cycleId ?? "";
  const selectedCycle = mockCycles.find((item) => item.id === effectiveCycleId);
  const issues = mockIssues.filter((issue) => {
    void reloadKey;
    return issue.cycle_id === effectiveCycleId;
  });

  const reloadIssues = () => setReloadKey((current) => current + 1);

  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Plane Clone
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Cycles
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">All Work Items</span>
      </div>

      <IssueHeader />

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Cycle details</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedCycle?.name ?? "Unknown cycle"}
            </p>
          </div>
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {issues.length} {issues.length === 1 ? "work item" : "work items"}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {selectedCycle?.description ??
            "This page displays all work items assigned to the selected cycle."}
        </p>
      </div>

      <IssueToolbar view={view} setView={setView} onCreated={reloadIssues} />

      {view === "list" ? (
        <IssueTable issues={issues} />
      ) : (
        <IssueBoard issues={issues} reload={reloadIssues} />
      )}
    </>
  );
};
