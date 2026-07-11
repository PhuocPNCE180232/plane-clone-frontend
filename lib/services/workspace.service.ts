/**
 * lib/services/workspace.service.ts
 *
 * Plain async functions for the Workspace domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (flat REST, no nested paths):
 *   GET    /workspaces          → Workspace[]
 *   GET    /workspaces/:id      → Workspace
 *   POST   /workspaces          → Workspace
 *   PATCH  /workspaces/:id      → Workspace
 *   DELETE /workspaces/:id      → void
 */

import { get, post, patch, del } from "@/lib/api/request";
import type { Workspace } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────
// Derived from the shared Workspace interface using TypeScript utility types.
// Omit server-generated fields that the client never sends.

/** Fields required when creating a new workspace. */
export type CreateWorkspaceDto = Omit<Workspace, "id" | "createdAt">;

/** All fields are optional on update (partial edit). */
export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>;

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all workspaces the current user has access to. */
export const getWorkspaces = (): Promise<Workspace[]> =>
  get<Workspace[]>("/workspaces");

/** Returns a single workspace by its ID. */
export const getWorkspaceById = (id: string): Promise<Workspace> =>
  get<Workspace>(`/workspaces/${id}`);

/** Creates a new workspace and returns the created resource. */
export const createWorkspace = (
  data: CreateWorkspaceDto
): Promise<Workspace> => post<Workspace, CreateWorkspaceDto>("/workspaces", data);

/** Partially updates a workspace and returns the updated resource. */
export const updateWorkspace = (
  id: string,
  data: UpdateWorkspaceDto
): Promise<Workspace> =>
  patch<Workspace, UpdateWorkspaceDto>(`/workspaces/${id}`, data);

/** Deletes a workspace. Most backends return 204 No Content. */
export const deleteWorkspace = (id: string): Promise<void> =>
  del<void>(`/workspaces/${id}`);
