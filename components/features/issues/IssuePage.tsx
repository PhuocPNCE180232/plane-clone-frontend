"use client";

import { useState } from "react";
import { toast } from "sonner";

import { IssueHeader } from "./IssueHeader";
import { IssueToolbar } from "./IssueToolbar";
import { IssueTable } from "./IssueTable";
import { IssueCalendar } from "./IssueCalendar";
import { ProjectIssuesAnalytics } from "./ProjectIssuesAnalytics";
import IssueBoard from "./board/IssueBoard";
import type { IssueView } from "./types";

import { useDeleteIssueMutation, useIssues } from "@/hooks/use-issues";

interface IssuePageProps {
  projectId: string;
}

export const IssuePage = ({ projectId }: IssuePageProps) => {
  const [view, setView] = useState<IssueView>("list");
  const { data: issues = [], refetch } = useIssues(projectId);
  const { mutate: deleteIssue } = useDeleteIssueMutation();

  const reloadIssues = () => {
    void refetch();
  };

  const handleDelete = (id: string) => {
    deleteIssue(
      { id },
      {
        onSuccess: () => toast.success("Issue deleted successfully!"),
        onError: () => toast.error("Delete failed"),
      },
    );
  };

  return (
    <>
      <IssueHeader />

      <IssueToolbar
        projectId={projectId}
        view={view}
        setView={setView}
        onCreated={reloadIssues}
        showProjectViews
      />

      {view === "list" && (
        <IssueTable
          issues={issues}
          onDelete={handleDelete}
        />
      )}

      {view === "board" && (
        <IssueBoard
          issues={issues}
          reload={reloadIssues}
        />
      )}

      {view === "calendar" && <IssueCalendar issues={issues} />}

      {view === "analytics" && <ProjectIssuesAnalytics issues={issues} />}
    </>
  );
};
