import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPages,
  getPage,
  createPage,
  renamePage,
  updatePage,
  deletePage,
  type CreatePageDto,
  type RenamePageDto,
  type UpdatePageDto,
} from "@/lib/services/page.service";
import type { Page } from "@/types";

// ─── Keys ──────────────────────────────────────────────────────────────────
// Three-level hierarchy matching memberKeys and projectKeys exactly:
//   all       ["pages"]
//   lists()   ["pages", "list"]
//   list(id)  ["pages", "list", projectId]

export const pageKeys = {
  all:    ["pages"] as const,
  lists:  () => [...pageKeys.all, "list"] as const,
  list:   (projectId?: string | null) =>
    [...pageKeys.lists(), projectId ?? "all"] as const,
  detail: (projectId?: string | null, id?: string | null) =>
    [...pageKeys.all, "detail", projectId ?? "all", id ?? "all"] as const,
};

// ─── Variable types ─────────────────────────────────────────────────────────
// Inline variable types follow use-projects.ts (UpdateProjectVariables pattern).

type CreatePageVariables = { projectId: string; data: CreatePageDto };
type RenamePageVariables = { projectId: string; id: string; data: RenamePageDto };
type UpdatePageVariables = { projectId: string; id: string; data: UpdatePageDto };
type DeletePageVariables = { projectId: string; id: string };

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Returns all pages that belong to the given project.
 * Scoped by projectId (URL param) rather than activeWorkspaceId because pages
 * are a project-level resource — same scoping pattern as getIssues(projectId).
 */
export const usePages = (projectId: string | null) =>
  useQuery({
    queryKey: pageKeys.list(projectId),
    queryFn:  () => getPages(projectId!),
    enabled:  !!projectId,
  });

/**
 * Returns a single page by ID.
 * Query key includes both projectId and pageId — matches projectKeys.detail(id)
 * convention so each page has its own cache entry.
 */
export const usePage = (projectId: string | null, pageId: string | null) =>
  useQuery({
    queryKey: pageKeys.detail(projectId, pageId),
    queryFn:  () => getPage(projectId!, pageId!),
    enabled:  !!projectId && !!pageId,
  });

/**
 * Mutation for creating a new page inside a project.
 * Invalidates the project's page list on success.
 * Toast feedback is handled by the calling component (CreateProjectModal pattern).
 */
export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Page, Error, CreatePageVariables>({
    mutationFn: ({ projectId, data }) => createPage(projectId, data),

    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.list(projectId),
      });
    },

    onError: (error) => {
      console.error("Failed to create page:", error);
    },
  });
};

/**
 * Mutation for renaming an existing page.
 * Invalidates the project's page list on success.
 * Toast feedback is handled by the calling component.
 */
export const useRenamePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Page, Error, RenamePageVariables>({
    mutationFn: ({ projectId, id, data }) => renamePage(projectId, id, data),

    onSuccess: (_, { projectId, id }) => {
      // Invalidate the list so the new name appears in PageList.
      queryClient.invalidateQueries({
        queryKey: pageKeys.list(projectId),
      });
      // Invalidate the detail entry so PageDetail title refreshes if open.
      queryClient.invalidateQueries({
        queryKey: pageKeys.detail(projectId, id),
      });
    },

    onError: (error) => {
      console.error("Failed to rename page:", error);
    },
  });
};

/**
 * Mutation for deleting a page from a project.
 * Invalidates the project's page list on success.
 * Toast feedback is handled by the calling component (CycleCard pattern).
 */
export const useDeletePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePageVariables>({
    mutationFn: ({ projectId, id }) => deletePage(projectId, id),

    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.list(projectId),
      });
    },

    onError: (error) => {
      console.error("Failed to delete page:", error);
    },
  });
};

/**
 * Mutation for updating a page's content (and optionally name).
 * Invalidates both the list and the detail cache so PageList name and
 * PageDetail content both refresh automatically.
 * Toast feedback is handled by the calling component.
 */
export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Page, Error, UpdatePageVariables>({
    mutationFn: ({ projectId, id, data }) => updatePage(projectId, id, data),

    onSuccess: (_, { projectId, id }) => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.list(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: pageKeys.detail(projectId, id),
      });
    },

    onError: (error) => {
      console.error("Failed to update page:", error);
    },
  });
};
