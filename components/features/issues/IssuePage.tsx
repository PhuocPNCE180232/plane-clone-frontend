"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { IssueHeader } from "./IssueHeader";
import { IssueToolbar } from "./IssueToolbar";
import { IssueTable } from "./IssueTable";
import IssueBoard from "./board/IssueBoard";

import {
  getIssues,
  deleteIssue,
} from "@/lib/services/issue.service";

import type { Issue } from "@/types";

interface IssuePageProps {
  projectId: string;
}

export const IssuePage = ({ projectId }: IssuePageProps) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [view, setView] = useState<"list" | "board">("list");

  const loadIssues = async () => {
    try {
      const data = await getIssues(projectId);
      setIssues(data);
    } catch {
      toast.error("Cannot load issues");
    }
  };

  useEffect(() => {
    loadIssues();
  }, [projectId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id);
      toast.success("Issue deleted successfully!");
      loadIssues();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span>Plane Clone</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">
          Work Items
        </span>
      </div>

      <IssueHeader />

      <IssueToolbar
        view={view}
        setView={setView}
        onCreated={loadIssues}
      />

      {view === "list" ? (
        <IssueTable
          issues={issues}
          onDelete={handleDelete}
        />
      ) : (
        <IssueBoard
          issues={issues}
          reload={loadIssues}
        />
      )}
    </>
  );
};