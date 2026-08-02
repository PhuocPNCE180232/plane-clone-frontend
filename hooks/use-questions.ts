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
  list:    () => [...questionKeys.lists()] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail:  (id: string) => [...questionKeys.details(), id] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/** Returns all questions. */
export const useQuestions = () =>
  useQuery({
    queryKey: questionKeys.list(),
    queryFn:  getQuestions,
  });

/** Returns a single question by ID. */
export const useQuestion = (id: string) =>
  useQuery({
    queryKey: questionKeys.detail(id),
    queryFn:  () => getQuestion(id),
    enabled:  !!id,
  });

/**
 * Mutation for creating a question.
 * Invalidates the questions list on success.
 */
export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Question, Error, CreateQuestionDto>({
    mutationFn: createQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list() });
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
    { questionId: string; data: AddAnswerDto }
  >({
    mutationFn: ({ questionId, data }) => addAnswer(questionId, data),

    onSuccess: (_, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list() });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) });
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
    { questionId: string; answerId: string }
  >({
    mutationFn: ({ questionId, answerId }) => deleteAnswer(questionId, answerId),

    onSuccess: (_, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list() });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) });
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

  return useMutation<void, Error, string>({
    mutationFn: deleteQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to delete question:", error);
    },
  });
};
