"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { IssueDetails } from "./IssueDetails";
import { CommentSection } from "./CommentSection";
import { EditIssueForm } from "./EditIssueForm";

import { getIssueById } from "@/lib/services/issue.service";
import { getProjects } from "@/lib/services/project.service";
import { getModules } from "@/lib/services/module.service";
import { getCycles } from "@/lib/services/cycle.service";
import { userService } from "@/lib/services/user.service";
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const [
          issueData,
          projectData,
          moduleData,
          cycleData,
          userData,
        ] = await Promise.all([
          getIssueById(issueId),
          getProjects(),
          getModules(),
          getCycles(),
          userService.getUsers(),
        ]);

        console.log("===== API DATA =====");
        console.log("issueData", issueData);
        console.log("projectData", projectData);
        console.log("moduleData", moduleData);
        console.log("cycleData", cycleData);
        console.log("userData", userData);

        setIssue(issueData);
        setProjects(projectData);
        setModules(moduleData);
        setCycles(cycleData);
        setUsers(userData);
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

  console.log("===== MATCH RESULT =====");
  console.log("issue", issue);
  console.log("projects", projects);
  console.log("users", users);
  console.log("modules", modules);
  console.log("cycles", cycles);

  const project = projects.find(
    (p) => p.id === issue?.project_id
  );
  const assignee = users.find(
    (u) => u.id === issue?.assignee_id
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
          <IssueDetails
            issue={
              issue
                ? {
                    ...issue,
                    project,
                    assignee,
                    module,
                    cycle,
                  }
                : undefined
            }
            onEdit={() => setEditing(true)}
          />

          <CommentSection issueId={issueId} />
        </div>

        <div className="col-span-1" />
      </div>

      {editing && issue && (
        <EditIssueForm
          issue={issue}
          onClose={() => setEditing(false)}
          onUpdated={async () => {
            const data = await getIssueById(issueId);
            setIssue(data);
            setEditing(false);
          }}
        />
      )}
    </>
  );
};