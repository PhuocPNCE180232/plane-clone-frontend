/**
 * mocks/handlers.ts
 *
 * MSW v2 request handlers.
 *
 * These handlers intercept requests made by the shared Axios client
 * (lib/api/client.ts), whose baseURL is NEXT_PUBLIC_API_URL
 * (default: http://localhost:8000/api/v1).
 *
 * Add domain handlers here as service modules are completed.
 * Example:
 *
 *   import { mockProjects } from "./db";
 *
 *   http.get(`${BASE}/projects`, () => HttpResponse.json(mockProjects)),
 *   http.post(`${BASE}/projects`, async ({ request }) => {
 *     const body = await request.json();
 *     return HttpResponse.json(body, { status: 201 });
 *   }),
 */

import { http, HttpResponse } from "msw";

export const BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Re-export http and HttpResponse so handler files don't need separate imports.
export { http, HttpResponse };

export const handlers: ReturnType<typeof http.all>[] = [];
