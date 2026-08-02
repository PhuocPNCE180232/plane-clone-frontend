import { useQuery } from "@tanstack/react-query";

import { getCycles, type Cycle } from "@/lib/services/cycle.service";
import { getIssues } from "@/lib/services/issue.service";
import { getModules, type Module } from "@/lib/services/module.service";
import { getProjects } from "@/lib/services/project.service";
import { useAppStore } from "@/hooks/use-app-store";
import type { Issue, Project } from "@/types";

export const workspaceDataKeys = {
  all: ["workspace-data"] as const,
  projects: (workspaceId?: string | null) =>
    [...workspaceDataKeys.all, "projects", workspaceId ?? "none"] as const,
  issues: () => [...workspaceDataKeys.all, "issues"] as const,
  cycles: () => [...workspaceDataKeys.all, "cycles"] as const,
  modules: () => [...workspaceDataKeys.all, "modules"] as const,
};

const getIssueProjectId = (issue: Issue) => {
  return issue.project_id || issue.projectId || "";
};

const safeFetch = async <Data>(
  fetcher: () => Promise<Data[]>,
): Promise<Data[]> => {
  try {
    return await fetcher();
  } catch {
    return [];
  }
};

export const useWorkspaceData = () => {
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId);

  const projectsQuery = useQuery<Project[], Error>({
    queryKey: workspaceDataKeys.projects(activeWorkspaceId),
    queryFn: async () => {
      const projects = await safeFetch(getProjects);

      if (!activeWorkspaceId) return projects;

      return projects.filter(
        (project) => project.workspaceId === activeWorkspaceId,
      );
    },
  });

  const issuesQuery = useQuery<Issue[], Error>({
    queryKey: workspaceDataKeys.issues(),
    queryFn: () => safeFetch(() => getIssues()),
  });

  const cyclesQuery = useQuery<Cycle[], Error>({
    queryKey: workspaceDataKeys.cycles(),
    queryFn: () => safeFetch(getCycles),
  });

  const modulesQuery = useQuery<Module[], Error>({
    queryKey: workspaceDataKeys.modules(),
    queryFn: () => safeFetch(getModules),
  });

  const projects = projectsQuery.data ?? [];
  const projectIds = new Set(projects.map((project) => project.id));

  const issues = (issuesQuery.data ?? []).filter((issue) => {
    if (projectIds.size === 0) return true;

    return projectIds.has(getIssueProjectId(issue));
  });

  const cycles = (cyclesQuery.data ?? []).filter((cycle) => {
    if (projectIds.size === 0) return true;

    return projectIds.has(cycle.project_id);
  });

  const modules = (modulesQuery.data ?? []).filter((module) => {
    if (projectIds.size === 0) return true;

    return projectIds.has(module.project_id);
  });

  return {
    activeWorkspaceId,
    projects,
    issues,
    cycles,
    modules,
    isLoading:
      projectsQuery.isLoading ||
      issuesQuery.isLoading ||
      cyclesQuery.isLoading ||
      modulesQuery.isLoading,
    isError: false,
  };
};