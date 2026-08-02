"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { issueKeys } from "@/hooks/use-issues";
import { ProjectCard } from "./ProjectCard";
import { useProjects } from "@/hooks/use-projects";
import { getIssues } from "@/lib/services/issue.service";
import type { Issue } from "@/types";

interface ProjectListProps {
  searchQuery?: string;
  activeTab?: string;
}

export const ProjectList = ({ searchQuery = "", activeTab = "all" }: ProjectListProps) => {
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const { data: issues = [], isLoading: isIssuesLoading } = useQuery<
    Issue[],
    Error
  >({
    queryKey: issueKeys.list(),
    queryFn: () => getIssues(),
  });
  const issueCountByProjectId = useMemo(() => {
    return issues.reduce<Map<string, number>>((counts, issue) => {
      counts.set(issue.project_id, (counts.get(issue.project_id) ?? 0) + 1);

      return counts;
    }, new Map());
  }, [issues]);

  if (isProjectsLoading || isIssuesLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p>No projects found in this workspace.</p>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    // 1. Filter by tab
    if (activeTab === "active" && project.status === "archived") return false;
    if (activeTab === "archived" && project.status !== "archived") return false;

    // 2. Filter by search query
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(lowerQuery) ||
      project.identifier.toLowerCase().includes(lowerQuery) ||
      (project.description && project.description.toLowerCase().includes(lowerQuery))
    );
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p>No projects match your search.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.name}
            description={project.description || "No description provided."}
            members={1} // Static fallback since API doesn't return members yet
            issues={issueCountByProjectId.get(project.id) ?? 0}
            createdAt={project.createdAt}
          />
        ))}
      </div>
    </section>
  );
};
