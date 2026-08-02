import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer,
  type CreateQuestionDto,
  type AddAnswerDto,
} from "@/lib/services/question.service";
import type { Question } from "@/types";

// ─── Keys ──────────────────────────────────────────────────────────────────

export const questionKeys = {
  all:     ["questions"] as const,
  lists:   () => [...questionKeys.all, "list"] as const,
  list:    (workspaceId?: string | null) =>
    [...questionKeys.lists(), workspaceId ?? "none"] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail:  (id: string, workspaceId?: string | null) =>
    [...questionKeys.details(), workspaceId ?? "none", id] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/** Returns questions for the selected workspace. */
export const useQuestions = (workspaceId?: string) =>
  useQuery({
    queryKey: questionKeys.list(workspaceId),
    queryFn: async () => {
      const questions = await getQuestions(workspaceId as string);
      return questions.filter((question) => question.workspace_id === workspaceId);
    },
    enabled: !!workspaceId,
  });

/** Returns a single question by ID. */
export const useQuestion = (id: string, workspaceId?: string) =>
  useQuery({
    queryKey: questionKeys.detail(id, workspaceId),
    queryFn:  () => getQuestion(id, workspaceId as string),
    enabled:  !!id && !!workspaceId,
  });

/**
 * Mutation for creating a question.
 * Invalidates the questions list on success.
 */
export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Question, Error, CreateQuestionDto>({
    mutationFn: createQuestion,

    onSuccess: (_question, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(variables.workspace_id),
      });
    },

    onError: (error) => {
      console.error("Failed to create question:", error);
    },
  });
};

/**
 * Mutation for adding an answer to a question.
 * Invalidates both list and detail queries on success.
 */
export const useAddAnswerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Question,
    Error,
    { questionId: string; workspaceId: string; data: AddAnswerDto }
  >({
    mutationFn: ({ questionId, workspaceId, data }) =>
      addAnswer(questionId, workspaceId, data),

    onSuccess: (_, { questionId, workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list(workspaceId) });
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(questionId, workspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to add answer:", error);
    },
  });
};

/**
 * Mutation for deleting an answer from a question.
 * Invalidates both list and detail queries on success.
 */
export const useDeleteAnswerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { questionId: string; answerId: string; workspaceId: string }
  >({
    mutationFn: ({ questionId, answerId, workspaceId }) =>
      deleteAnswer(questionId, answerId, workspaceId),

    onSuccess: (_, { questionId, workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list(workspaceId) });
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(questionId, workspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to delete answer:", error);
    },
  });
};

/**
 * Mutation for deleting a question.
 * Invalidates the questions list on success.
 */
export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { questionId: string; workspaceId: string }>({
    mutationFn: ({ questionId, workspaceId }) =>
      deleteQuestion(questionId, workspaceId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(variables.workspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to delete question:", error);
    },
  });
};
