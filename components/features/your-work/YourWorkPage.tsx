"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import { YourWorkHeader } from "./YourWorkHeader";
import { YourWorkEmptyState } from "./YourWorkEmptyState";
import { YourWorkList } from "./YourWorkList";
import { WorkspaceHomeLink } from "@/components/shared/WorkspaceHomeLink";
import { useAuth } from "@/hooks/use-auth";
import { useAssignedWorkItems } from "@/hooks/use-assigned-work-items";

export const YourWorkPage = () => {
  const { user } = useAuth();
  const { workItems, isLoading, isError } = useAssignedWorkItems(user?.id);

  return (
    <>
      {/* Breadcrumb — same pattern as every other page */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <WorkspaceHomeLink>Plane Clone</WorkspaceHomeLink>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Your Work</span>
      </div>

      <YourWorkHeader />

      {!user || isLoading ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center shadow-sm">
          <Loader2 className="mb-3 h-7 w-7 animate-spin text-[#3f76ff]" />
          <p className="text-sm font-medium text-gray-600">Loading your work...</p>
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          Could not load your assigned work items. Please try again.
        </div>
      ) : workItems.length > 0 ? (
        <YourWorkList workItems={workItems} />
      ) : (
        <YourWorkEmptyState />
      )}
    </>
  );
};
