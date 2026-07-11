/**
 * lib/services/module.service.ts
 *
 * Plain async functions for the Module domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (flat REST, no nested paths):
 *   GET    /modules             → Module[]
 *   GET    /modules/:id         → Module
 *   POST   /modules             → Module
 *   PATCH  /modules/:id         → Module
 *   DELETE /modules/:id         → void
 *
 * NOTE ON TYPES
 * The Module type is not yet exported from types/index.ts (it exists only in
 * mocks/db.ts). A minimal Module interface is defined locally here until the
 * shared type system is extended. When Module is added to types/index.ts,
 * replace the local interface with:
 *   import type { Module } from "@/types";
 */

import { get, post, patch, del } from "@/lib/api/request";

// ─── Local type (promote to types/index.ts when backend contract confirmed) ─

export interface Module {
  id: string;
  projectId: string;
  name: string;
  description?: string;
}

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields sent when creating a new module. */
export type CreateModuleDto = Omit<Module, "id">;

/** All fields are optional on update. */
export type UpdateModuleDto = Partial<CreateModuleDto>;

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all modules. */
export const getModules = (): Promise<Module[]> =>
  get<Module[]>("/modules");

/** Returns a single module by its ID. */
export const getModuleById = (id: string): Promise<Module> =>
  get<Module>(`/modules/${id}`);

/** Creates a new module and returns the created resource. */
export const createModule = (data: CreateModuleDto): Promise<Module> =>
  post<Module, CreateModuleDto>("/modules", data);

/** Partially updates a module and returns the updated resource. */
export const updateModule = (
  id: string,
  data: UpdateModuleDto
): Promise<Module> =>
  patch<Module, UpdateModuleDto>(`/modules/${id}`, data);

/** Deletes a module. Most backends return 204 No Content. */
export const deleteModule = (id: string): Promise<void> =>
  del<void>(`/modules/${id}`);
