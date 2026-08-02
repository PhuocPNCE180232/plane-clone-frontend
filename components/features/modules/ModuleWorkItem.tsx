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
import { getModuleById } from "@/lib/services/module.service";
import { useDeleteIssueMutation, useIssues } from "@/hooks/use-issues";
import { toast } from "sonner";

interface ModuleWorkItemProps {
  moduleId: string;
}

export const ModuleWorkItem = ({ moduleId }: ModuleWorkItemProps) => {
  const [view, setView] = useState<IssueView>("list");
  const params = useParams();
  const effectiveModuleId = moduleId ?? params?.moduleId ?? "";
  const { data: selectedModule } = useQuery({
    queryKey: ["modules", "detail", effectiveModuleId],
    queryFn: () => getModuleById(effectiveModuleId),
    enabled: Boolean(effectiveModuleId),
  });

  const workspaceSlug = (params?.workspaceSlug as string) ?? "";
  const projectId =
    (params?.projectId as string) ?? selectedModule?.project_id ?? "";
  const modulesHref =
    workspaceSlug && projectId
      ? `/${workspaceSlug}/projects/${projectId}/modules`
      : "#";
  const { data: projectIssues = [], refetch: refetchIssues } = useIssues(projectId);
  const { mutate: deleteIssue } = useDeleteIssueMutation();
  const issues = projectIssues.filter(
    (issue) => issue.module_id === effectiveModuleId,
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
          href={modulesHref}
          className="transition-colors hover:text-gray-900"
        >
          Modules
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="max-w-[200px] truncate font-medium text-gray-900">
          {selectedModule?.name ?? effectiveModuleId}
        </span>
      </div>

      <IssueHeader />

      

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Module details
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedModule?.name ?? "Unknown module"}
            </p>
          </div>
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {issues.length} {issues.length === 1 ? "work item" : "work items"}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {selectedModule?.description ??
            "This page displays all work items assigned to the selected module."}
        </p>
      </div>

      {selectedModule && (
        <IssueToolbar
          projectId={selectedModule.project_id}
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
