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
 * Both types/index.ts and mocks/db.ts use snake_case (project_id,
 * assignee_id, created_at, module_id, cycle_id) as agreed upon by the team.
 */

import { get, post, patch, del } from "@/lib/api/request";
import type { Issue } from "@/types";
import type { Comment } from "@/mocks/db";
// ─── DTO types ─────────────────────────────────────────────────────────────

/**
 * Fields sent when creating a new issue using snake_case.
 */
export interface CreateIssuePayload {
  project_id: string;
  title: string;
  description: string;
  state: string;
  priority: string;
  assignee_id: string | null;
  module_id?: string | null;
  cycle_id?: string | null;
}

export type CreateIssueDto = CreateIssuePayload;

/** All fields are optional on update (partial edit). */
export type UpdateIssueDto = Partial<CreateIssuePayload>;

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all issues the current user can access. */
export const getIssues = (project_id?: string): Promise<Issue[]> =>
  get<Issue[]>(
    project_id ? `/issues?project_id=${project_id}` : "/issues"
  );

/** Returns a single issue by its ID. */
export const getIssueById = (id: string): Promise<Issue> =>
  get<Issue>(`/issues/${id}`);

/** Creates a new issue and returns the created resource. */
export const createIssue = (data: CreateIssuePayload): Promise<Issue> =>
  post<Issue, CreateIssuePayload>("/issues", data);

/** Partially updates an issue and returns the updated resource. */
export const updateIssue = (
  id: string,
  data: UpdateIssueDto
): Promise<Issue> =>
  patch<Issue, UpdateIssueDto>(`/issues/${id}`, data);

/** Deletes an issue. Most backends return 204 No Content. */
export const deleteIssue = (id: string): Promise<void> =>
  del<void>(`/issues/${id}`);

export const getCommentsByIssueId = (
  issueId: string
): Promise<Comment[]> =>
  get<Comment[]>(`/issues/${issueId}/comments`);