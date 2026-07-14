import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/lib/services/workspace.service";
import { useAppStore } from "./use-app-store";
import { useEffect } from "react";

export const useWorkspaces = () => {
  const { activeWorkspaceId, setWorkspace } = useAppStore();

  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  // Auto-select the first workspace if none is selected, or clear it if there are no workspaces
  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.length > 0) {
        const currentWorkspaceExists = query.data.find(w => w.id === activeWorkspaceId);
        if (!activeWorkspaceId || !currentWorkspaceExists) {
          setWorkspace(query.data[0].id);
        }
      } else {
        if (activeWorkspaceId !== null) {
          setWorkspace(null);
        }
      }
    }
  }, [query.isSuccess, query.data, activeWorkspaceId, setWorkspace]);

  return query;
};
