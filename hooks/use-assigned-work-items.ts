import { useQuery } from "@tanstack/react-query";
import { getIssues } from "@/lib/services/issue.service";
import { getProjects } from "@/lib/services/project.service";
import { getWorkspaces } from "@/lib/services/workspace.service";
import type { Issue, Project, Workspace } from "@/types";

export type AssignedWorkItem = {
  issue: Issue;
  project: Project;
  workspace: Workspace;
};

const assignedWorkItemKeys = {
  issues: (userId?: string) => ["your-work", "issues", userId ?? "anonymous"] as const,
  projects: (userId?: string) => ["your-work", "projects", userId ?? "anonymous"] as const,
  workspaces: (userId?: string) => ["your-work", "workspaces", userId ?? "anonymous"] as const,
};

export const useAssignedWorkItems = (userId?: string) => {
  const enabled = Boolean(userId);

  const issuesQuery = useQuery<Issue[], Error>({
    queryKey: assignedWorkItemKeys.issues(userId),
    queryFn: () => getIssues(),
    enabled,
    staleTime: 0,
  });

  const projectsQuery = useQuery<Project[], Error>({
    queryKey: assignedWorkItemKeys.projects(userId),
    queryFn: getProjects,
    enabled,
    staleTime: 0,
  });

  const workspacesQuery = useQuery<Workspace[], Error>({
    queryKey: assignedWorkItemKeys.workspaces(userId),
    queryFn: getWorkspaces,
    enabled,
    staleTime: 0,
  });

  const projectsById = new Map(
    (projectsQuery.data ?? []).map((project) => [project.id, project]),
  );
  const workspacesById = new Map(
    (workspacesQuery.data ?? []).map((workspace) => [workspace.id, workspace]),
  );

  const workItems: AssignedWorkItem[] = (issuesQuery.data ?? []).flatMap(
    (issue) => {
      if (issue.assignee_id !== userId) return [];

      const project = projectsById.get(issue.project_id);
      if (!project) return [];

      const workspace = workspacesById.get(project.workspaceId);
      if (!workspace) return [];

      return [{ issue, project, workspace }];
    },
  );

  return {
    workItems,
    isLoading:
      enabled &&
      (issuesQuery.isLoading ||
        projectsQuery.isLoading ||
        workspacesQuery.isLoading),
    isError:
      issuesQuery.isError || projectsQuery.isError || workspacesQuery.isError,
  };
};
