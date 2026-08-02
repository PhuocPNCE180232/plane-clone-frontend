/**
 * lib/services/page.service.ts
 *
 * Plain async functions for the Page domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (nested under projects):
 *   GET    /projects/:projectId/pages          → Page[]
 *   GET    /projects/:projectId/pages/:id      → Page
 *   POST   /projects/:projectId/pages          → Page
 *   PATCH  /projects/:projectId/pages/:id      → Page
 *   DELETE /projects/:projectId/pages/:id      → void
 */

import { get, post, patch, del } from "@/lib/api/request";
import type { Page } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields required when creating a new page. */
export type CreatePageDto = {
  name: string;
  content?: string;
};

/** Fields required when renaming an existing page. */
export type RenamePageDto = {
  name: string;
};

/**
 * Fields allowed when updating an existing page's content (and optionally name).
 * At least one field must be present — enforced by the MSW handler.
 */
export type UpdatePageDto = {
  name?: string;
  content?: string;
};

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all pages that belong to the given project. */
export const getPages = (projectId: string): Promise<Page[]> =>
  get<Page[]>(`/projects/${projectId}/pages`);

/** Returns a single page by ID. */
export const getPage = (projectId: string, id: string): Promise<Page> =>
  get<Page>(`/projects/${projectId}/pages/${id}`);

/** Creates a new page inside the given project and returns the created resource. */
export const createPage = (projectId: string, data: CreatePageDto): Promise<Page> =>
  post<Page, CreatePageDto>(`/projects/${projectId}/pages`, data);

/** Renames an existing page and returns the updated resource. */
export const renamePage = (projectId: string, id: string, data: RenamePageDto): Promise<Page> =>
  patch<Page, RenamePageDto>(`/projects/${projectId}/pages/${id}`, data);

/** Updates a page's name and/or content and returns the updated resource. */
export const updatePage = (projectId: string, id: string, data: UpdatePageDto): Promise<Page> =>
  patch<Page, UpdatePageDto>(`/projects/${projectId}/pages/${id}`, data);

/** Deletes a page by ID. Returns void (204 No Content). */
export const deletePage = (projectId: string, id: string): Promise<void> =>
  del<void>(`/projects/${projectId}/pages/${id}`);
