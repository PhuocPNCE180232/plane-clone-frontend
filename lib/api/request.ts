/**
 * lib/api/request.ts
 *
 * Generic HTTP helper functions.
 *
 * These are thin wrappers around the shared Axios client that:
 *   • Unwrap response.data so service functions receive T directly.
 *   • Use TypeScript generics so callers get full type safety.
 *   • Do NOT catch or re-normalise errors — the response interceptor in
 *     client.ts already converts every failure into a typed ApiError before
 *     it reaches these helpers. Double-wrapping is intentionally avoided.
 *
 * Usage in a service file:
 *
 *   import { get, post } from "@/lib/api/request";
 *
 *   export const getProjects = () =>
 *     get<Project[]>("/workspaces/my-workspace/projects/");
 *
 *   export const createIssue = (data: CreateIssueInput) =>
 *     post<Issue, CreateIssueInput>("/issues/", data);
 */

import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

// ─── GET ───────────────────────────────────────────────────────────────────

/**
 * Sends a GET request and returns the response body typed as T.
 *
 * @param url    - Endpoint path relative to NEXT_PUBLIC_API_URL.
 * @param config - Optional Axios config (headers, params, signal, etc.).
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

// ─── POST ──────────────────────────────────────────────────────────────────

/**
 * Sends a POST request with an optional request body and returns T.
 *
 * @param url    - Endpoint path relative to NEXT_PUBLIC_API_URL.
 * @param data   - Request body (will be JSON-serialised by Axios).
 * @param config - Optional Axios config.
 *
 * @typeParam T - Shape of the successful response body.
 * @typeParam D - Shape of the request body. Defaults to unknown.
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

// ─── PUT ───────────────────────────────────────────────────────────────────

/**
 * Sends a PUT request (full resource replacement) and returns T.
 *
 * @param url    - Endpoint path relative to NEXT_PUBLIC_API_URL.
 * @param data   - Request body.
 * @param config - Optional Axios config.
 *
 * @typeParam T - Shape of the successful response body.
 * @typeParam D - Shape of the request body. Defaults to unknown.
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

// ─── PATCH ─────────────────────────────────────────────────────────────────

/**
 * Sends a PATCH request (partial resource update) and returns T.
 *
 * @param url    - Endpoint path relative to NEXT_PUBLIC_API_URL.
 * @param data   - Partial request body.
 * @param config - Optional Axios config.
 *
 * @typeParam T - Shape of the successful response body.
 * @typeParam D - Shape of the request body. Defaults to unknown.
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

// ─── DELETE ────────────────────────────────────────────────────────────────

/**
 * Sends a DELETE request and returns T.
 *
 * Many DELETE endpoints return an empty body (204 No Content).
 * In those cases use `del<void>(...)` as the type parameter.
 *
 * @param url    - Endpoint path relative to NEXT_PUBLIC_API_URL.
 * @param config - Optional Axios config.
 *
 * @typeParam T - Shape of the successful response body. Defaults to void.
 */
export async function del<T = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}
