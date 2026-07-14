import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/services/project.service";
import { useAppStore } from "./use-app-store";
import { useEffect } from "react";

export const useProjects = () => {
  const { activeWorkspaceId, activeProjectId, setProject } = useAppStore();

  const query = useQuery({
    queryKey: ["projects", activeWorkspaceId],
    queryFn: async () => {
      // In a real app, we'd pass workspaceId to getProjects or the API would filter it
      const allProjects = await getProjects();
      return allProjects.filter((p) => p.workspaceId === activeWorkspaceId);
    },
    enabled: !!activeWorkspaceId,
  });

  // Auto-select the first project if none is selected, or clear it if there are no projects
  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.length > 0) {
        // Only set if not already set OR if the currently set project is not in the list (e.g., switched workspace)
        const currentProjectExists = query.data.find(p => p.id === activeProjectId);
        if (!activeProjectId || !currentProjectExists) {
          setProject(query.data[0].id);
        }
      } else {
        // Clear activeProjectId if there are no projects in this workspace
        if (activeProjectId !== null) {
          setProject(null);
        }
      }
    }
  }, [query.isSuccess, query.data, activeProjectId, setProject]);

  return query;
};
