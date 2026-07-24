"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { IssueHeader } from "./IssueHeader";
import { IssueToolbar } from "./IssueToolbar";
import { IssueTable } from "./IssueTable";
import { deleteIssue } from "@/lib/services/issue.service";

interface IssuePageProps {
  projectId: string;
}

export const IssuePage = ({ projectId }: IssuePageProps) => {
  const [reloadKey, setReloadKey] = useState(0);

  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id);
      // Trigger reload lại danh sách Issue trong IssueTable
      setReloadKey((x) => x + 1);
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Plane Clone
        </span>

        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />

        <span className="font-medium text-gray-900">
          Work Items
        </span>
      </div>

      <IssueHeader />
      <IssueToolbar
        onCreated={() => setReloadKey((x) => x + 1)}
      />
      <IssueTable
        projectId={projectId}
        reloadKey={reloadKey}
        onDelete={handleDelete}
      />
    </>
  );
};