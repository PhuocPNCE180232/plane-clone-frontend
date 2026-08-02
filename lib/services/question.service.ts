/**
 * lib/services/question.service.ts
 *
 * Plain async functions for the Question domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoints:
 *   GET    /questions        → Question[]
 *   POST   /questions        → Question
 *   DELETE /questions/:id    → void
 */

import { get, post, del } from "@/lib/api/request";
import type { Question } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields required when creating a new question. */
export type CreateQuestionDto = {
  title: string;
  description: string;
  workspace_id: string;
  author?: string;
  avatar?: string;
};

/** Fields required when adding an answer to a question. */
export type AddAnswerDto = {
  content: string;
  author?: string;
  avatar?: string;
};

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns questions for one workspace. */
export const getQuestions = (workspaceId: string): Promise<Question[]> =>
  get<Question[]>(`/questions?workspace_id=${encodeURIComponent(workspaceId)}`);

/** Returns a single question by ID. */
export const getQuestion = (id: string, workspaceId: string): Promise<Question> =>
  get<Question>(`/questions/${id}?workspace_id=${encodeURIComponent(workspaceId)}`);

/** Creates a new question and returns the created resource. */
export const createQuestion = (data: CreateQuestionDto): Promise<Question> =>
  post<Question, CreateQuestionDto>("/questions", data);

/** Adds an answer to a question and returns the updated resource. */
export const addAnswer = (
  questionId: string,
  workspaceId: string,
  data: AddAnswerDto,
): Promise<Question> =>
  post<Question, AddAnswerDto>(
    `/questions/${questionId}/answers?workspace_id=${encodeURIComponent(workspaceId)}`,
    data,
  );

/** Deletes an answer from a question by ID. Returns void (204 No Content). */
export const deleteAnswer = (
  questionId: string,
  answerId: string,
  workspaceId: string,
): Promise<void> =>
  del<void>(
    `/questions/${questionId}/answers/${answerId}?workspace_id=${encodeURIComponent(workspaceId)}`,
  );

/** Deletes a question by ID. Returns void (204 No Content). */
export const deleteQuestion = (id: string, workspaceId: string): Promise<void> =>
  del<void>(`/questions/${id}?workspace_id=${encodeURIComponent(workspaceId)}`);
