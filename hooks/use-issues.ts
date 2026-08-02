import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

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
  projectId: string;
};

type UpdateIssueContext = {
  previousIssueLists: IssueListSnapshot;
  previousIssue?: Issue;
};

type DeleteIssueContext = {
  previousIssueLists: IssueListSnapshot;
  previousIssue?: Issue;
};

type IssueProjectShape = {
  projectId?: string | null;
  project_id?: string | null;
};

const workspaceIssuesQueryKey = ["workspace-data", "issues"] as const;

const getIssueProjectId = (issue: IssueProjectShape) => {
  return issue.projectId ?? issue.project_id ?? "";
};

const removeIssueFromList = (issues: Issue[] = [], issueId: string) => {
  return issues.filter((issue) => issue.id !== issueId);
};

const addOrReplaceIssueInList = (
  issues: Issue[] = [],
  targetIssue: Issue,
) => {
  return [
    targetIssue,
    ...issues.filter((issue) => issue.id !== targetIssue.id),
  ];
};

const replaceIssueInList = (
  issues: Issue[] = [],
  targetIssue: Issue,
  optimisticIssueId?: string,
) => {
  return issues.map((issue) => {
    if (issue.id === targetIssue.id || issue.id === optimisticIssueId) {
      return targetIssue;
    }

    return issue;
  });
};

const mergeIssueUpdate = (issue: Issue, data: UpdateIssueDto): Issue => {
  return {
    ...issue,
    ...data,
    state: (data.state as Issue["state"]) ?? issue.state,
    priority: (data.priority as Issue["priority"]) ?? issue.priority,
  };
};

const invalidateIssueQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: issueKeys.all,
  });

  queryClient.invalidateQueries({
    queryKey: workspaceIssuesQueryKey,
  });
};

export const useIssues = (projectId?: string) => {
  const { activeProjectId } = useAppStore();
  const selectedProjectId = projectId ?? activeProjectId ?? undefined;

  return useQuery<Issue[], Error>({
    queryKey: issueKeys.list(selectedProjectId),
    queryFn: () => getIssues(selectedProjectId),
    enabled: !!selectedProjectId,
  });
};

export const useIssue = (issueId?: string) => {
  return useQuery<Issue, Error>({
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
      const projectId = getIssueProjectId(newIssue as IssueProjectShape);
      const createdAt = new Date().toISOString();

      await queryClient.cancelQueries({
        queryKey: issueKeys.all,
      });

      const previousIssues = queryClient.getQueryData<Issue[]>(
        issueKeys.list(projectId),
      );

      const optimisticIssue = {
        ...newIssue,
        id: `temp-${Date.now()}`,
        project_id: projectId,
        projectId,
        created_at: createdAt,
        createdAt,
      } as Issue;

      queryClient.setQueryData<Issue[]>(
        issueKeys.list(projectId),
        (oldIssues = []) => addOrReplaceIssueInList(oldIssues, optimisticIssue),
      );

      return { previousIssues, optimisticIssue, projectId };
    },

    onError: (_error, _newIssue, context) => {
      if (!context) return;

      queryClient.setQueryData(
        issueKeys.list(context.projectId),
        context.previousIssues,
      );
    },

    onSuccess: (createdIssue, _newIssue, context) => {
      const projectId = getIssueProjectId(createdIssue) || context.projectId;

      queryClient.setQueriesData<Issue[]>(
        { queryKey: issueKeys.lists() },
        (oldIssues = []) =>
          replaceIssueInList(
            oldIssues,
            createdIssue,
            context.optimisticIssue.id,
          ),
      );

      queryClient.setQueryData<Issue[]>(
        issueKeys.list(projectId),
        (oldIssues = []) =>
          addOrReplaceIssueInList(
            removeIssueFromList(oldIssues, context.optimisticIssue.id),
            createdIssue,
          ),
      );

      if (projectId !== context.projectId) {
        queryClient.setQueryData<Issue[]>(
          issueKeys.list(context.projectId),
          (oldIssues = []) =>
            removeIssueFromList(
              removeIssueFromList(oldIssues, context.optimisticIssue.id),
              createdIssue.id,
            ),
        );
      }

      queryClient.setQueryData(issueKeys.detail(createdIssue.id), createdIssue);
    },

    onSettled: () => {
      invalidateIssueQueries(queryClient);
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
            issue.id === id ? mergeIssueUpdate(issue, data) : issue,
          ),
      );

      queryClient.setQueryData<Issue>(issueKeys.detail(id), (oldIssue) => {
        if (!oldIssue) return oldIssue;

        return mergeIssueUpdate(oldIssue, data);
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

    onSuccess: (updatedIssue) => {
      const projectId = getIssueProjectId(updatedIssue);

      queryClient.setQueriesData<Issue[]>(
        { queryKey: issueKeys.lists() },
        (oldIssues = []) => replaceIssueInList(oldIssues, updatedIssue),
      );

      if (projectId) {
        queryClient.setQueryData<Issue[]>(
          issueKeys.list(projectId),
          (oldIssues = []) => addOrReplaceIssueInList(oldIssues, updatedIssue),
        );
      }

      queryClient.setQueryData(issueKeys.detail(updatedIssue.id), updatedIssue);
    },

    onSettled: (_data, _error, variables) => {
      invalidateIssueQueries(queryClient);

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
        (oldIssues = []) => removeIssueFromList(oldIssues, id),
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
      invalidateIssueQueries(queryClient);
    },
  });
};