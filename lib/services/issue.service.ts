/**
 * lib/services/issue.service.ts
 *
 * Plain async functions for the Issue domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (flat REST, no nested paths):
 *   GET    /issues              → Issue[]
 *   GET    /issues/:id          → Issue
 *   POST   /issues              → Issue
 *   PATCH  /issues/:id          → Issue
 *   DELETE /issues/:id          → void
 *
 * NOTE ON TYPES
 * The shared Issue type in types/index.ts uses camelCase (projectId,
 * assigneeId, createdAt) while mocks/db.ts uses snake_case (project_id,
 * assignee_id, created_at). The service types here follow types/index.ts
 * because that is the shared contract for the frontend. The backend team
 * must confirm whether their JSON responses use camelCase or snake_case,
 * and a transformer/interceptor may be needed if they differ.
 */

import { get, post, patch, del } from "@/lib/api/request";
import type { Issue } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────

/**
 * Fields sent when creating a new issue.
 * Omit server-generated fields: id, createdAt.
 */
export type CreateIssueDto = Omit<Issue, "id" | "createdAt">;

/** All fields are optional on update (partial edit). */
export type UpdateIssueDto = Partial<CreateIssueDto>;

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all issues the current user can access. */
export const getIssues = (): Promise<Issue[]> =>
  get<Issue[]>("/issues");

/** Returns a single issue by its ID. */
export const getIssueById = (id: string): Promise<Issue> =>
  get<Issue>(`/issues/${id}`);

/** Creates a new issue and returns the created resource. */
export const createIssue = (data: CreateIssueDto): Promise<Issue> =>
  post<Issue, CreateIssueDto>("/issues", data);

/** Partially updates an issue and returns the updated resource. */
export const updateIssue = (
  id: string,
  data: UpdateIssueDto
): Promise<Issue> =>
  patch<Issue, UpdateIssueDto>(`/issues/${id}`, data);

/** Deletes an issue. Most backends return 204 No Content. */
export const deleteIssue = (id: string): Promise<void> =>
  del<void>(`/issues/${id}`);
