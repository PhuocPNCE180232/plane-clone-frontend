"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { IssueDetails } from "./IssueDetails";
import { CommentSection } from "./CommentSection";

import { getIssueById } from "@/lib/services/issue.service";
import { getProjects } from "@/lib/services/project.service";
import { getModules } from "@/lib/services/module.service";
import { getCycles } from "@/lib/services/cycle.service";
import type { Issue } from "@/types";

interface IssueDetailPageProps {
  issueId: string;
}

export const IssueDetailPage = ({
  issueId,
}: IssueDetailPageProps) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const [
          issueData,
          projectData,
          moduleData,
          cycleData,
        ] = await Promise.all([
          getIssueById(issueId),
          getProjects(),
          getModules(),
          getCycles(),
        ]);

        setIssue(issueData);
        setProjects(projectData);
        setModules(moduleData);
        setCycles(cycleData);
      } catch (error) {
        console.error(error);
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

  const project = projects.find(
    (p) => p.id === issue?.project_id
  );
  const module = modules.find(
    (m) => m.id === issue?.module_id
  );
  const cycle = cycles.find(
    (c) => c.id === issue?.cycle_id
  );

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
          <IssueDetails
            issue={
              issue
                ? {
                    ...issue,
                    project,
                    module,
                    cycle,
                  }
                : undefined
            }
          />

          <CommentSection issueId={issueId} />

        </div>

        <div className="col-span-1" />
      </div>
    </>
  );
};