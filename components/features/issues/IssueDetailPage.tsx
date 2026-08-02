"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { IssueDetails } from "./IssueDetails";
import { CommentSection } from "./CommentSection";
import { EditIssueForm } from "./EditIssueForm";

import { getIssueById } from "@/lib/services/issue.service";
import { getProjects } from "@/lib/services/project.service";
import { getModules, type Module } from "@/lib/services/module.service";
import { getCycles, type Cycle } from "@/lib/services/cycle.service";
import { userService } from "@/lib/services/user.service";
import type { Issue, Project, User } from "@/types";

interface IssueDetailPageProps {
  issueId: string;
  projectId: string;
}

export const IssueDetailPage = ({
  issueId,
  projectId,
}: IssueDetailPageProps) => {
  const params = useParams<{ workspaceSlug?: string }>();
  const workspaceSlug = params?.workspaceSlug ?? "";
  const issuesHref = workspaceSlug
    ? `/${workspaceSlug}/projects/${projectId}/issues`
    : "#";
  const [issue, setIssue] = useState<Issue | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const issueData = await getIssueById(issueId);

        if (issueData.project_id !== projectId) {
          setIssue(null);
          return;
        }

        const [projectData, moduleData, cycleData, userData] = await Promise.all([
          getProjects(),
          getModules(),
          getCycles(),
          userService.getUsers(),
        ]);

        setIssue(issueData);
        setProjects(projectData);
        setModules(moduleData);
        setCycles(cycleData);
        setUsers(userData);
      } catch (error) {
        console.error("Failed to load work item:", error);
        setIssue(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueId, projectId]);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-8 text-gray-500">
        Work item not found in this project.
      </div>
    );
  }

  const project = projects.find(
    (p) => p.id === issue.project_id
  );
  const assignee = users.find(
    (u) => u.id === issue.assignee_id
  );
  const issueModule = modules.find(
    (m) => m.id === issue.module_id
  );
  const cycle = cycles.find(
    (c) => c.id === issue.cycle_id
  );

  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={issuesHref}
          className="transition-colors hover:text-gray-900"
        >
          Work Items
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="max-w-[200px] truncate font-medium text-gray-900">
          {issue.title}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <IssueDetails
            issue={{
              ...issue,
              project,
              assignee,
              module: issueModule,
              cycle,
            }}
            onEdit={() => setEditing(true)}
          />

          <CommentSection issueId={issueId} />
        </div>

        <div className="col-span-1" />
      </div>

      {editing && (
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
