/**
 * lib/services/project.service.ts
 *
 * Plain async functions for the Project domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (flat REST, no nested paths):
 *   GET    /projects            → Project[]
 *   GET    /projects/:id        → Project
 *   POST   /projects            → Project
 *   PATCH  /projects/:id        → Project
 *   DELETE /projects/:id        → void
 */

import { get, post, patch, del } from "@/lib/api/request";
import type { Project } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields required when creating a new project. */
export type CreateProjectDto = Omit<Project, "id">;

/** All fields are optional on update (partial edit). */
export type UpdateProjectDto = Partial<CreateProjectDto>;

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all projects the current user can access. */
export const getProjects = (): Promise<Project[]> =>
  get<Project[]>("/projects");

/** Returns a single project by its ID. */
export const getProjectById = (id: string): Promise<Project> =>
  get<Project>(`/projects/${id}`);

/** Creates a new project and returns the created resource. */
export const createProject = (data: CreateProjectDto): Promise<Project> =>
  post<Project, CreateProjectDto>("/projects", data);

/** Partially updates a project and returns the updated resource. */
export const updateProject = (
  id: string,
  data: UpdateProjectDto
): Promise<Project> =>
  patch<Project, UpdateProjectDto>(`/projects/${id}`, data);

/** Deletes a project. Most backends return 204 No Content. */
export const deleteProject = (id: string): Promise<void> =>
  del<void>(`/projects/${id}`);
