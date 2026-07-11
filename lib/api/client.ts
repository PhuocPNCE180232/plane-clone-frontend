/**
 * lib/api/client.ts
 *
 * The single Axios instance used by every service function in this project.
 * All base URL configuration and cross-cutting concerns live here.
 *
 * ─── TEAM NOTES ───────────────────────────────────────────────────────────
 *
 * • Do NOT create additional Axios instances anywhere else.
 * • Import `apiClient` only from lib/api/request.ts helper functions.
 *   Prefer the generic helpers (get / post / put / patch / del) over calling
 *   apiClient directly from service files.
 *
 * • AUTHORIZATION HEADER
 *   The request interceptor below is intentionally left as a neutral
 *   extension point. Do NOT add token injection here until:
 *     1. The backend team confirms the authentication contract
 *        (e.g. Bearer JWT, session cookie, API key).
 *     2. The storage strategy for the token is agreed upon
 *        (httpOnly cookie set by backend, localStorage, Zustand store, etc.).
 *   When both are confirmed, add the header attachment inside the
 *   "TODO: inject Authorization header" comment block below.
 *
 * • 401 / SESSION HANDLING
 *   The response interceptor does NOT redirect or clear cookies.
 *   Token refresh and logout flows must be implemented after the backend
 *   contract is confirmed. Add them here at that point.
 */

import axios, { InternalAxiosRequestConfig } from "axios";
import { normaliseError } from "./error";

// ─── Configuration ─────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ─── Axios instance ────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  /**
   * withCredentials: true — browser will include cookies on every request.
   * Required when the backend uses httpOnly session cookies.
   * Safe to keep enabled even before the backend is ready.
   */
  withCredentials: true,
  /** Abort requests that take longer than 10 seconds. */
  timeout: 10_000,
});

// ─── Request interceptor ───────────────────────────────────────────────────
// Runs before every outgoing request.
//
// Currently a neutral pass-through.
// Add Authorization header injection here once the backend token contract
// and client-side storage strategy are confirmed.

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: inject Authorization header
    // Example (Bearer JWT stored in Zustand / secure cookie / etc.):
    //
    //   const token = getTokenFromAgreedStorage();
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    //
    // Do NOT read plane_session here — that cookie is a mock UI flag only
    // and does not represent a real authentication token.

    return config;
  },
  (error: unknown) => {
    // Request setup failed before it was sent (e.g. invalid config).
    return Promise.reject(normaliseError(error));
  }
);

// ─── Response interceptor ─────────────────────────────────────────────────
// Runs after every response.
//
// Responsibilities (intentionally minimal):
//   ✓ Pass successful responses through unchanged.
//   ✓ Normalise all errors into a typed ApiError.
//   ✗ Does NOT redirect.
//   ✗ Does NOT clear cookies or local storage.
//   ✗ Does NOT attempt token refresh.
//
// Token refresh and session expiry handling must be added here after the
// backend authentication contract is confirmed.

apiClient.interceptors.response.use(
  // Success — return response as-is so callers receive the full AxiosResponse.
  (response) => response,

  // Error — normalise into ApiError and re-throw.
  // Downstream service functions and React Query hooks will receive a
  // typed ApiError with { message, status, code } on every failure.
  (error: unknown) => Promise.reject(normaliseError(error))
);
