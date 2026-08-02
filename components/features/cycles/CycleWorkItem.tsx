"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import IssueBoard from "@/components/features/issues/board/IssueBoard";
import { IssueHeader } from "@/components/features/issues/IssueHeader";
import { IssueToolbar } from "@/components/features/issues/IssueToolbar";
import { IssueTable } from "@/components/features/issues/IssueTable";
import type { IssueView } from "@/components/features/issues/types";
import { getCycleById } from "@/lib/services/cycle.service";
import { useDeleteIssueMutation, useIssues } from "@/hooks/use-issues";
import { toast } from "sonner";

interface CycleWorkItemProps {
  cycleId?: string;
}

const getRouteParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const CycleWorkItem = ({ cycleId }: CycleWorkItemProps) => {
  const [view, setView] = useState<IssueView>("list");
  const params = useParams();

  const effectiveCycleId = cycleId ?? getRouteParam(params?.cycleId);
  const { data: selectedCycle } = useQuery({
    queryKey: ["cycles", "detail", effectiveCycleId],
    queryFn: () => getCycleById(effectiveCycleId),
    enabled: Boolean(effectiveCycleId),
  });
  const workspaceSlug = getRouteParam(params?.workspaceSlug);
  const projectId =
    getRouteParam(params?.projectId) || selectedCycle?.project_id || "";
  const cyclesHref =
    workspaceSlug && projectId
      ? `/${workspaceSlug}/projects/${projectId}/cycles`
      : "#";
  const { data: projectIssues = [], refetch: refetchIssues } = useIssues(projectId);
  const { mutate: deleteIssue } = useDeleteIssueMutation();
  const issues = projectIssues.filter(
    (issue) => issue.cycle_id === effectiveCycleId,
  );

  const reloadIssues = () => {
    void refetchIssues();
  };

  const handleDelete = (id: string) => {
    deleteIssue(
      { id },
      {
        onSuccess: () => {
          toast.success("Issue deleted successfully!");
          reloadIssues();
        },
        onError: () => toast.error("Delete failed"),
      },
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={cyclesHref}
          className="transition-colors hover:text-gray-900"
        >
          Cycles
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="max-w-[200px] truncate font-medium text-gray-900">
          {selectedCycle?.name ?? effectiveCycleId}
        </span>
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

      {selectedCycle && (
        <IssueToolbar
          projectId={selectedCycle.project_id}
          view={view}
          setView={setView}
          onCreated={reloadIssues}
        />
      )}

      {view === "list" ? (
        <IssueTable issues={issues} onDelete={handleDelete} />
      ) : (
        <IssueBoard issues={issues} reload={reloadIssues} />
      )}
    </>
  );
};
