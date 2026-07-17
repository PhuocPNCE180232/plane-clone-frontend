/**
 * lib/services/cycle.service.ts
 *
 * Plain async functions for the Cycle domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (flat REST, no nested paths):
 *   GET    /cycles              → Cycle[]
 *   GET    /cycles/:id          → Cycle
 *   POST   /cycles              → Cycle
 *   PATCH  /cycles/:id          → Cycle
 *   DELETE /cycles/:id          → void
 *
 * NOTE ON TYPES
 * The Cycle type is not yet exported from types/index.ts (it exists only in
 * mocks/db.ts). A minimal Cycle interface is defined locally here until the
 * shared type system is extended. When Cycle is added to types/index.ts,
 * replace the local interface with:
 *   import type { Cycle } from "@/types";
 */

import { get, post, patch, del } from "@/lib/api/request";

// ─── Local type (promote to types/index.ts when backend contract confirmed) ─

export interface Cycle {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  progress?: number;
}

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields sent when creating a new cycle. */
export type CreateCycleDto = Omit<Cycle, "id">;

/** All fields are optional on update. */
export type UpdateCycleDto = Partial<CreateCycleDto>;

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all cycles. */
export const getCycles = (): Promise<Cycle[]> =>
  get<Cycle[]>("/cycles");

/** Returns a single cycle by its ID. */
export const getCycleById = (id: string): Promise<Cycle> =>
  get<Cycle>(`/cycles/${id}`);

/** Creates a new cycle and returns the created resource. */
export const createCycle = (data: CreateCycleDto): Promise<Cycle> =>
  post<Cycle, CreateCycleDto>("/cycles", data);

/** Partially updates a cycle and returns the updated resource. */
export const updateCycle = (
  id: string,
  data: UpdateCycleDto
): Promise<Cycle> =>
  patch<Cycle, UpdateCycleDto>(`/cycles/${id}`, data);

/** Deletes a cycle. Most backends return 204 No Content. */
export const deleteCycle = (id: string): Promise<void> =>
  del<void>(`/cycles/${id}`);
