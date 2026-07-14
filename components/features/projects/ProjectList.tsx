"use client";

import { Loader2 } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { useProjects } from "@/hooks/use-projects";

interface ProjectListProps {
  searchQuery?: string;
}

export const ProjectList = ({ searchQuery = "" }: ProjectListProps) => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
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
            issues={0}  // Static fallback since API doesn't return issues yet
            createdAt={project.createdAt}
          />
        ))}
      </div>
    </section>
  );
};