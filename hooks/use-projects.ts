import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type CreateProjectDto,
  type UpdateProjectDto,
} from "@/lib/services/project.service";
import type { Project } from "@/types";
import { useAppStore } from "./use-app-store";
import { useEffect } from "react";

// --- Keys ---
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (workspaceId?: string | null) =>
    [...projectKeys.lists(), workspaceId ?? "all"] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
};

// --- Types ---
type UpdateProjectVariables = {
  id: string;
  data: UpdateProjectDto;
};

type DeleteProjectVariables = {
  id: string;
};

type ProjectListSnapshot = Array<[readonly unknown[], Project[] | undefined]>;

type CreateProjectContext = {
  previousProjects?: Project[];
  optimisticProject: Project;
};

type UpdateProjectContext = {
  previousProjectLists: ProjectListSnapshot;
  previousProject?: Project;
};

type DeleteProjectContext = {
  previousProjectLists: ProjectListSnapshot;
  previousProject?: Project;
};

// --- Hooks ---

export const useProjects = () => {
  const { activeWorkspaceId, activeProjectId, setProject } = useAppStore();

  const query = useQuery({
    queryKey: projectKeys.list(activeWorkspaceId),
    queryFn: async () => {
      const allProjects = await getProjects();
      return allProjects.filter((p) => p.workspaceId === activeWorkspaceId);
    },
    enabled: !!activeWorkspaceId,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.length > 0) {
        const currentProjectExists = query.data.find((p) => p.id === activeProjectId);
        if (!activeProjectId || !currentProjectExists) {
          setProject(query.data[0].id);
        }
      } else {
        if (activeProjectId !== null) {
          setProject(null);
        }
      }
    }
  }, [query.isSuccess, query.data, activeProjectId, setProject]);

  return query;
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectDto, CreateProjectContext>({
    mutationFn: createProject,

    onMutate: async (newProject) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.list(newProject.workspaceId),
      });

      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.list(newProject.workspaceId)
      );

      const optimisticProject: Project = {
        ...newProject,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        network: newProject.network || "public",
      } as Project;

      queryClient.setQueryData<Project[]>(
        projectKeys.list(newProject.workspaceId),
        (oldProjects = []) => [optimisticProject, ...oldProjects]
      );

      return { previousProjects, optimisticProject };
    },

    onError: (_error, newProject, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(
          projectKeys.list(newProject.workspaceId),
          context.previousProjects
        );
      }
    },

    onSuccess: (createdProject, _newProject, context) => {
      queryClient.setQueryData<Project[]>(
        projectKeys.list(createdProject.workspaceId),
        (oldProjects = []) =>
          oldProjects.map((project) =>
            project.id === context.optimisticProject.id ? createdProject : project
          )
      );

      queryClient.setQueryData(projectKeys.detail(createdProject.id), createdProject);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
      });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, UpdateProjectVariables, UpdateProjectContext>({
    mutationFn: ({ id, data }) => updateProject(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.all,
      });

      const previousProjectLists = queryClient.getQueriesData<Project[]>({
        queryKey: projectKeys.lists(),
      });

      const previousProject = queryClient.getQueryData<Project>(
        projectKeys.detail(id)
      );

      queryClient.setQueriesData<Project[]>(
        { queryKey: projectKeys.lists() },
        (oldProjects = []) =>
          oldProjects.map((project) =>
            project.id === id ? { ...project, ...data } : project
          )
      );

      queryClient.setQueryData<Project>(projectKeys.detail(id), (oldProject) =>
        oldProject ? { ...oldProject, ...data } : oldProject
      );

      return { previousProjectLists, previousProject };
    },

    onError: (_error, variables, context) => {
      context?.previousProjectLists.forEach(([queryKey, projects]) => {
        queryClient.setQueryData(queryKey, projects);
      });

      if (context?.previousProject) {
        queryClient.setQueryData(
          projectKeys.detail(variables.id),
          context.previousProject
        );
      }
    },

    onSuccess: (updatedProject) => {
      queryClient.setQueriesData<Project[]>(
        { queryKey: projectKeys.lists() },
        (oldProjects = []) =>
          oldProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
      );

      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteProjectVariables, DeleteProjectContext>({
    mutationFn: ({ id }) => deleteProject(id),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.all,
      });

      const previousProjectLists = queryClient.getQueriesData<Project[]>({
        queryKey: projectKeys.lists(),
      });

      const previousProject = queryClient.getQueryData<Project>(
        projectKeys.detail(id)
      );

      queryClient.setQueriesData<Project[]>(
        { queryKey: projectKeys.lists() },
        (oldProjects = []) => oldProjects.filter((project) => project.id !== id)
      );

      queryClient.removeQueries({
        queryKey: projectKeys.detail(id),
      });

      return { previousProjectLists, previousProject };
    },

    onError: (_error, variables, context) => {
      context?.previousProjectLists.forEach(([queryKey, projects]) => {
        queryClient.setQueryData(queryKey, projects);
      });

      if (context?.previousProject) {
        queryClient.setQueryData(
          projectKeys.detail(variables.id),
          context.previousProject
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
};
