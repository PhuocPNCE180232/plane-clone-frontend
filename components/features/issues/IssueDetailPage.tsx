"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { IssueDetails } from "./IssueDetails";
import { CommentSection } from "./CommentSection";

import { getIssueById } from "@/lib/services/issue.service";
import type { Issue } from "@/types";

interface IssueDetailPageProps {
  issueId: string;
}

export const IssueDetailPage = ({
  issueId,
}: IssueDetailPageProps) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await getIssueById(issueId);

        console.log("Issue API:", data);

        setIssue(data);
      } catch (error) {
        console.error("Load issue failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueId]);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Plane Clone
        </span>

        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />

        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Work Items
        </span>

        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />

        <span className="font-medium text-gray-900">
          {issueId}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">

          {/* Truyền dữ liệu issue sang */}
          <IssueDetails issue={issue ?? undefined} />

          <CommentSection issueId={issueId} />

        </div>

        <div className="col-span-1" />
      </div>
    </>
  );
};