/**
 * lib/services/community.service.ts
 *
 * Plain async functions for the Community domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoints:
 *   GET    /community        → CommunityPost[]
 *   POST   /community        → CommunityPost
 *   DELETE /community/:id    → void
 */

import { get, post, patch, del } from "@/lib/api/request";
import type { CommunityPost } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields required when creating a new community post. */
export type CreatePostDto = {
  content: string;
  workspace_id: string;
  author?: string;
  avatar?: string;
};

/** Fields required when adding a comment to a community post. */
export type AddCommentDto = {
  content: string;
  author?: string;
  avatar?: string;
};

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns community posts for one workspace. */
export const getPosts = (workspaceId: string): Promise<CommunityPost[]> =>
  get<CommunityPost[]>(`/community?workspace_id=${encodeURIComponent(workspaceId)}`);

/** Creates a new community post and returns the created resource. */
export const createPost = (data: CreatePostDto): Promise<CommunityPost> =>
  post<CommunityPost, CreatePostDto>("/community", data);

/** Toggles like status on a post and returns the updated resource. */
export const toggleLike = (
  postId: string,
  workspaceId: string,
): Promise<CommunityPost> =>
  patch<CommunityPost>(
    `/community/${postId}/like?workspace_id=${encodeURIComponent(workspaceId)}`,
    {},
  );

/** Adds a comment to a post and returns the updated resource. */
export const addComment = (
  postId: string,
  workspaceId: string,
  data: AddCommentDto,
): Promise<CommunityPost> =>
  post<CommunityPost, AddCommentDto>(
    `/community/${postId}/comments?workspace_id=${encodeURIComponent(workspaceId)}`,
    data,
  );

/** Deletes a comment from a post by ID. Returns void (204 No Content). */
export const deleteComment = (
  postId: string,
  commentId: string,
  workspaceId: string,
): Promise<void> =>
  del<void>(
    `/community/${postId}/comments/${commentId}?workspace_id=${encodeURIComponent(workspaceId)}`,
  );

/** Deletes a community post by ID. Returns void (204 No Content). */
export const deletePost = (id: string, workspaceId: string): Promise<void> =>
  del<void>(`/community/${id}?workspace_id=${encodeURIComponent(workspaceId)}`);

