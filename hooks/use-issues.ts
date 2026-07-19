import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIssue,
  deleteIssue,
  getIssueById,
  getIssues,
  updateIssue,
  type CreateIssueDto,
  type UpdateIssueDto,
} from "@/lib/services/issue.service";
import type { Issue } from "@/types";
import { useAppStore } from "./use-app-store";

export const issueKeys = {
  all: ["issues"] as const,
  lists: () => [...issueKeys.all, "list"] as const,
  list: (projectId?: string | null) =>
    [...issueKeys.lists(), projectId ?? "all"] as const,
  detail: (id: string) => [...issueKeys.all, "detail", id] as const,
};

type UpdateIssueVariables = {
  id: string;
  data: UpdateIssueDto;
};

type DeleteIssueVariables = {
  id: string;
};

type IssueListSnapshot = Array<[readonly unknown[], Issue[] | undefined]>;

type CreateIssueContext = {
  previousIssues?: Issue[];
  optimisticIssue: Issue;
};

type UpdateIssueContext = {
  previousIssueLists: IssueListSnapshot;
  previousIssue?: Issue;
};

type DeleteIssueContext = {
  previousIssueLists: IssueListSnapshot;
  previousIssue?: Issue;
};

export const useIssues = (projectId?: string) => {
  const { activeProjectId } = useAppStore();
  const selectedProjectId = projectId ?? activeProjectId ?? undefined;

  return useQuery({
    queryKey: issueKeys.list(selectedProjectId),
    queryFn: () => getIssues(selectedProjectId),
    enabled: !!selectedProjectId,
  });
};

export const useIssue = (issueId?: string) => {
  return useQuery({
    queryKey: issueId ? issueKeys.detail(issueId) : issueKeys.detail(""),
    queryFn: () => getIssueById(issueId as string),
    enabled: !!issueId,
  });
};

export const useCreateIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Issue, Error, CreateIssueDto, CreateIssueContext>({
    mutationFn: createIssue,

    onMutate: async (newIssue) => {
      await queryClient.cancelQueries({
        queryKey: issueKeys.list(newIssue.projectId),
      });

      const previousIssues = queryClient.getQueryData<Issue[]>(
        issueKeys.list(newIssue.projectId),
      );

      const optimisticIssue: Issue = {
        ...newIssue,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Issue[]>(
        issueKeys.list(newIssue.projectId),
        (oldIssues = []) => [optimisticIssue, ...oldIssues],
      );

      return { previousIssues, optimisticIssue };
    },

    onError: (_error, newIssue, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(
          issueKeys.list(newIssue.projectId),
          context.previousIssues,
        );
      }
    },

    onSuccess: (createdIssue, _newIssue, context) => {
      queryClient.setQueryData<Issue[]>(
        issueKeys.list(createdIssue.projectId),
        (oldIssues = []) =>
          oldIssues.map((issue) =>
            issue.id === context.optimisticIssue.id ? createdIssue : issue,
          ),
      );

      queryClient.setQueryData(issueKeys.detail(createdIssue.id), createdIssue);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: issueKeys.list(variables.projectId),
      });
    },
  });
};

export const useUpdateIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Issue, Error, UpdateIssueVariables, UpdateIssueContext>({
    mutationFn: ({ id, data }) => updateIssue(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: issueKeys.all,
      });

      const previousIssueLists = queryClient.getQueriesData<Issue[]>({
        queryKey: issueKeys.lists(),
      });

      const previousIssue = queryClient.getQueryData<Issue>(
        issueKeys.detail(id),
      );

      queryClient.setQueriesData<Issue[]>(
        { queryKey: issueKeys.lists() },
        (oldIssues = []) =>
          oldIssues.map((issue) =>
            issue.id === id ? { ...issue, ...data } : issue,
          ),
      );

      queryClient.setQueryData<Issue>(issueKeys.detail(id), (oldIssue) =>
        oldIssue ? { ...oldIssue, ...data } : oldIssue,
      );

      return { previousIssueLists, previousIssue };
    },

    onError: (_error, variables, context) => {
      context?.previousIssueLists.forEach(([queryKey, issues]) => {
        queryClient.setQueryData(queryKey, issues);
      });

      if (context?.previousIssue) {
        queryClient.setQueryData(
          issueKeys.detail(variables.id),
          context.previousIssue,
        );
      }
    },

    onSuccess: (updatedIssue) => {
      queryClient.setQueriesData<Issue[]>(
        { queryKey: issueKeys.lists() },
        (oldIssues = []) =>
          oldIssues.map((issue) =>
            issue.id === updatedIssue.id ? updatedIssue : issue,
          ),
      );

      queryClient.setQueryData(issueKeys.detail(updatedIssue.id), updatedIssue);
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: issueKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: issueKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteIssueVariables, DeleteIssueContext>({
    mutationFn: ({ id }) => deleteIssue(id),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: issueKeys.all,
      });

      const previousIssueLists = queryClient.getQueriesData<Issue[]>({
        queryKey: issueKeys.lists(),
      });

      const previousIssue = queryClient.getQueryData<Issue>(
        issueKeys.detail(id),
      );

      queryClient.setQueriesData<Issue[]>(
        { queryKey: issueKeys.lists() },
        (oldIssues = []) => oldIssues.filter((issue) => issue.id !== id),
      );

      queryClient.removeQueries({
        queryKey: issueKeys.detail(id),
      });

      return { previousIssueLists, previousIssue };
    },

    onError: (_error, variables, context) => {
      context?.previousIssueLists.forEach(([queryKey, issues]) => {
        queryClient.setQueryData(queryKey, issues);
      });

      if (context?.previousIssue) {
        queryClient.setQueryData(
          issueKeys.detail(variables.id),
          context.previousIssue,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: issueKeys.all,
      });
    },
  });
};
