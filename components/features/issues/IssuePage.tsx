"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { IssueHeader } from "./IssueHeader";
import { IssueToolbar, type IssueView } from "./IssueToolbar";
import { IssueTable } from "./IssueTable";
import IssueBoard from "./board/IssueBoard";
import { IssueAnalyticsView } from "./IssueAnalyticsView";
import { IssueCalendarView } from "./IssueCalendarView";
import { IssueSavedViews } from "./IssueSavedViews";

import {
  getIssues,
  deleteIssue,
} from "@/lib/services/issue.service";

interface IssuePageProps {
  projectId: string;
}

const issuePageKeys = {
  list: (projectId: string) => ["issues", "page", projectId] as const,
};

export const IssuePage = ({ projectId }: IssuePageProps) => {
  const [view, setView] = useState<IssueView>("list");

  const queryClient = useQueryClient();

  const issuesQuery = useQuery({
    queryKey: issuePageKeys.list(projectId),
    queryFn: () => getIssues(projectId),
  });

  const issues = issuesQuery.data ?? [];

  const loadIssues = () => {
    queryClient.invalidateQueries({
      queryKey: issuePageKeys.list(projectId),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id);
      toast.success("Issue deleted successfully!");
      loadIssues();
    } catch {
      toast.error("Delete failed");
    }
  };

  const renderView = () => {
    if (issuesQuery.isLoading) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-400">
          Loading issues...
        </div>
      );
    }

    if (issuesQuery.isError) {
      return (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-500">
          Cannot load issues.
        </div>
      );
    }

    if (view === "list") {
      return (
        <IssueTable
          issues={issues}
          onDelete={handleDelete}
        />
      );
    }

    if (view === "board") {
      return (
        <IssueBoard
          issues={issues}
          reload={loadIssues}
        />
      );
    }

    if (view === "calendar") {
      return <IssueCalendarView issues={issues} />;
    }

    if (view === "analytics") {
      return <IssueAnalyticsView issues={issues} />;
    }

    return <IssueSavedViews projectId={projectId} />;
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

      {renderView()}
    </>
  );
};