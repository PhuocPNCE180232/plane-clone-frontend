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
  issues: (workspaceId?: string | null) =>
    [...workspaceDataKeys.all, "issues", workspaceId ?? "none"] as const,
  cycles: (workspaceId?: string | null) =>
    [...workspaceDataKeys.all, "cycles", workspaceId ?? "none"] as const,
  modules: (workspaceId?: string | null) =>
    [...workspaceDataKeys.all, "modules", workspaceId ?? "none"] as const,
};

const getIssueProjectId = (issue: Issue) => {
  return issue.project_id;
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
  const hasActiveWorkspace = !!activeWorkspaceId;

  const projectsQuery = useQuery<Project[], Error>({
    queryKey: workspaceDataKeys.projects(activeWorkspaceId),
    queryFn: async () => {
      const projects = await safeFetch(getProjects);
      return projects.filter(
        (project) => project.workspaceId === activeWorkspaceId,
      );
    },
    enabled: hasActiveWorkspace,
  });

  const issuesQuery = useQuery<Issue[], Error>({
    queryKey: workspaceDataKeys.issues(activeWorkspaceId),
    queryFn: () => safeFetch(() => getIssues()),
    enabled: hasActiveWorkspace,
  });

  const cyclesQuery = useQuery<Cycle[], Error>({
    queryKey: workspaceDataKeys.cycles(activeWorkspaceId),
    queryFn: () => safeFetch(getCycles),
    enabled: hasActiveWorkspace,
  });

  const modulesQuery = useQuery<Module[], Error>({
    queryKey: workspaceDataKeys.modules(activeWorkspaceId),
    queryFn: () => safeFetch(getModules),
    enabled: hasActiveWorkspace,
  });

  const projects = projectsQuery.data ?? [];
  const projectIds = new Set(projects.map((project) => project.id));

  const issues = (issuesQuery.data ?? []).filter((issue) =>
    projectIds.has(getIssueProjectId(issue)),
  );

  const cycles = (cyclesQuery.data ?? []).filter((cycle) =>
    projectIds.has(cycle.project_id),
  );

  const modules = (modulesQuery.data ?? []).filter((module) =>
    projectIds.has(module.project_id),
  );

  return {
    activeWorkspaceId,
    projects,
    issues,
    cycles,
    modules,
    isLoading:
      hasActiveWorkspace &&
      (projectsQuery.isLoading ||
        issuesQuery.isLoading ||
        cyclesQuery.isLoading ||
        modulesQuery.isLoading),
    isError: false,
  };
};
