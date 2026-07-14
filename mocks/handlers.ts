/**
 * mocks/handlers.ts
 *
 * MSW v2 request handlers.
 *
 * These handlers intercept requests made by the shared Axios client
 * (lib/api/client.ts), whose baseURL is NEXT_PUBLIC_API_URL
 * (default: http://localhost:8000/api/v1).
 */

import { http, HttpResponse } from "msw";
import { mockUsers, mockWorkspaces, mockProjects, User, Workspace, Project, saveToStorage } from "./db";

export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

// Helper to wrap all JSON responses with CORS headers
function jsonResponse(body: any, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  headers.set("Access-Control-Allow-Credentials", "true");
  return HttpResponse.json(body, { ...init, headers });
}

export { http, HttpResponse };

const getSessionId = (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  let sessionId = cookieHeader?.split("plane_session=")?.[1]?.split(";")?.[0];
  if (!sessionId && typeof document !== "undefined") {
    sessionId = document.cookie?.split("plane_session=")?.[1]?.split(";")?.[0];
  }
  return sessionId;
};

export const handlers: ReturnType<typeof http.all>[] = [
  // --- MOCK CORS PREFLIGHT ---
  http.options(`${BASE}/*`, () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }),

  // --- AUTH ---
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email, password } = body;

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return jsonResponse({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password if the user has one set
    if (user.password && user.password !== password) {
      return jsonResponse({ error: "Invalid credentials" }, { status: 401 });
    }

    return jsonResponse({ user, token: "mock_token_" + user.id }, {
      headers: {
        "Set-Cookie": `plane_session=${user.id}; Path=/; HttpOnly`,
      },
    });
  }),

  http.post(`${BASE}/auth/signup`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email, name, password } = body;

    const existing = mockUsers.find((u) => u.email === email);
    if (existing) {
      return jsonResponse({ error: "Email already in use" }, { status: 400 });
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name: name || email.split("@")[0],
      email,
      avatar: "",
      password,
    };
    mockUsers.push(newUser);
    saveToStorage("mockUsers", mockUsers);

    return jsonResponse({ user: newUser, token: "mock_token_" + newUser.id }, {
      headers: {
        "Set-Cookie": `plane_session=${newUser.id}; Path=/; HttpOnly`,
      },
    });
  }),

  http.get(`${BASE}/users/me`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const user = mockUsers.find((u) => u.id === sessionId);
    if (!user) {
      return jsonResponse({ error: "User not found" }, { status: 404 });
    }

    return jsonResponse({ user });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    return jsonResponse({ success: true }, {
      headers: {
        "Set-Cookie": `plane_session=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  }),

  // --- ONBOARDING (WORKSPACES & PROJECTS) ---
  http.get(`${BASE}/workspaces`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    // For development, return all workspaces since we haven't implemented members yet.
    return jsonResponse(mockWorkspaces);
  }),

  http.post(`${BASE}/workspaces`, async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      const sessionId = getSessionId(request);

      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const existing = mockWorkspaces.find(w => w.slug === body.slug);
      if (existing) {
        return jsonResponse({ error: "Workspace URL is already taken" }, { status: 400 });
      }

      const newWorkspace: Workspace = {
        id: `w${Date.now()}`,
        name: body.name,
        slug: body.slug,
        owner_id: sessionId,
      };
      mockWorkspaces.push(newWorkspace);
      saveToStorage("mockWorkspaces", mockWorkspaces);

      return jsonResponse(newWorkspace, { status: 201 });
    } catch (e: any) {
      console.error("MSW Error in POST /workspaces:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.patch(`${BASE}/workspaces/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as any;
      const index = mockWorkspaces.findIndex(w => w.id === id);
      if (index === -1) return jsonResponse({ error: "Workspace not found" }, { status: 404 });

      mockWorkspaces[index] = { ...mockWorkspaces[index], ...body };
      saveToStorage("mockWorkspaces", mockWorkspaces);

      return jsonResponse(mockWorkspaces[index]);
    } catch (e: any) {
      console.error("MSW Error in PATCH /workspaces:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.delete(`${BASE}/workspaces/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockWorkspaces.findIndex(w => w.id === id);
      if (index === -1) return jsonResponse({ error: "Workspace not found" }, { status: 404 });

      mockWorkspaces.splice(index, 1);
      saveToStorage("mockWorkspaces", mockWorkspaces);

      return jsonResponse({ success: true });
    } catch (e: any) {
      console.error("MSW Error in DELETE /workspaces:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.get(`${BASE}/projects`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    // The user can fetch all projects in the workspace. Since we don't have workspace validation yet, we just return all mock projects.
    // In a real app, it would filter by workspaceId. Let's return all projects.
    return jsonResponse(mockProjects);
  }),

  http.post(`${BASE}/projects`, async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      const sessionId = getSessionId(request);

      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const newProject: Project = {
        id: `p${Date.now()}`,
        workspaceId: body.workspaceId || mockWorkspaces[0]?.id || "w1",
        name: body.name,
        identifier: body.identifier,
        description: body.description || "",
        createdAt: new Date().toISOString(),
        network: body.network || "public",
      };
      mockProjects.push(newProject);
      saveToStorage("mockProjects", mockProjects);

      return jsonResponse(newProject, { status: 201 });
    } catch (e: any) {
      console.error("MSW Error in POST /projects:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.patch(`${BASE}/projects/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as any;
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) return jsonResponse({ error: "Project not found" }, { status: 404 });

      mockProjects[index] = { ...mockProjects[index], ...body };
      saveToStorage("mockProjects", mockProjects);

      return jsonResponse(mockProjects[index]);
    } catch (e: any) {
      console.error("MSW Error in PATCH /projects:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.delete(`${BASE}/projects/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) return jsonResponse({ error: "Project not found" }, { status: 404 });

      mockProjects.splice(index, 1);
      saveToStorage("mockProjects", mockProjects);

      return jsonResponse({ success: true });
    } catch (e: any) {
      console.error("MSW Error in DELETE /projects:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),
];
