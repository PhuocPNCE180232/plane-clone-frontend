import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  activeWorkspaceId: string | null;
  activeProjectId: string | null;
  setWorkspace: (id: string | null) => void;
  setProject: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activeProjectId: null,

      setWorkspace: (id: string | null) => set({ activeWorkspaceId: id }),
      setProject: (id: string | null) => set({ activeProjectId: id }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        activeProjectId: state.activeProjectId,
      }),
    }
  )
);
