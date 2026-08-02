import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProjectView,
  deleteProjectView,
  getProjectViews,
  type CreateCustomViewDto,
  type CustomView,
} from "@/lib/services/view.service";

export const viewKeys = {
  all: ["views"] as const,
  project: (projectId: string) => [...viewKeys.all, projectId] as const,
};

type DeleteViewVariables = {
  projectId: string;
  viewId: string;
};

type CreateViewContext = {
  previousViews?: CustomView[];
  optimisticView: CustomView;
};

type DeleteViewContext = {
  previousViews?: CustomView[];
};

export const useProjectViews = (projectId: string) => {
  return useQuery({
    queryKey: viewKeys.project(projectId),
    queryFn: () => getProjectViews(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProjectViewMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    CustomView,
    Error,
    CreateCustomViewDto,
    CreateViewContext
  >({
    mutationFn: (data) => createProjectView(projectId, data),

    onMutate: async (newView) => {
      await queryClient.cancelQueries({
        queryKey: viewKeys.project(projectId),
      });

      const previousViews = queryClient.getQueryData<CustomView[]>(
        viewKeys.project(projectId),
      );

      const optimisticView: CustomView = {
        id: `temp-view-${Date.now()}`,
        project_id: projectId,
        name: newView.name,
        filters: newView.filters ?? {},
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<CustomView[]>(
        viewKeys.project(projectId),
        (oldViews = []) => [optimisticView, ...oldViews],
      );

      return { previousViews, optimisticView };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousViews) {
        queryClient.setQueryData(
          viewKeys.project(projectId),
          context.previousViews,
        );
      }
    },

    onSuccess: (createdView, _variables, context) => {
      queryClient.setQueryData<CustomView[]>(
        viewKeys.project(projectId),
        (oldViews = []) =>
          oldViews.map((view) =>
            context && view.id === context.optimisticView.id
              ? createdView
              : view,
          ),
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: viewKeys.project(projectId),
      });
    },
  });
};

export const useDeleteProjectViewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteViewVariables, DeleteViewContext>({
    mutationFn: ({ projectId, viewId }) => deleteProjectView(projectId, viewId),

    onMutate: async ({ projectId, viewId }) => {
      await queryClient.cancelQueries({
        queryKey: viewKeys.project(projectId),
      });

      const previousViews = queryClient.getQueryData<CustomView[]>(
        viewKeys.project(projectId),
      );

      queryClient.setQueryData<CustomView[]>(
        viewKeys.project(projectId),
        (oldViews = []) => oldViews.filter((view) => view.id !== viewId),
      );

      return { previousViews };
    },

    onError: (_error, variables, context) => {
      if (context?.previousViews) {
        queryClient.setQueryData(
          viewKeys.project(variables.projectId),
          context.previousViews,
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: viewKeys.project(variables.projectId),
      });
    },
  });
};