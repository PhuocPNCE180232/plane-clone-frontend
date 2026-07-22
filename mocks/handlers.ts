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
import {
  mockUsers,
  mockWorkspaces,
  mockProjects,
  mockCycles,
  mockModules,
  mockIssues,
  mockComments,
  User,
  Workspace,
  Project,
  Module,
  saveToStorage,
} from "./db";

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
        logo: body.logo || '',
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
        status: "active",
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

  // --- MODULES ---
  http.get(`${BASE}/modules`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    return jsonResponse(mockModules);
  }),

  http.post(`${BASE}/modules`, async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const newModule: Module = {
        id: `m${Date.now()}`,
        project_id: body.project_id || "p1",
        name: body.name,
        description: body.description || "",
        progress: body.progress ?? 0,
      };

      mockModules.push(newModule);
      saveToStorage("mockModules", mockModules);

      return jsonResponse(newModule, { status: 201 });
    } catch (e: any) {
      console.error("MSW Error in POST /modules:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.get(`${BASE}/modules/:id`, async ({ request, params }) => {
    const sessionId = getSessionId(request);
    if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    const moduleItem = mockModules.find(m => m.id === params.id);
    if (!moduleItem) return jsonResponse({ error: "Module not found" }, { status: 404 });
    return jsonResponse(moduleItem);
  }),

  http.patch(`${BASE}/modules/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as any;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockModules.findIndex((m) => m.id === id);
      if (index === -1) return jsonResponse({ error: "Module not found" }, { status: 404 });

      mockModules[index] = {
        ...mockModules[index],
        ...body,
      };
      saveToStorage("mockModules", mockModules);

      return jsonResponse(mockModules[index]);
    } catch (e: any) {
      console.error("MSW Error in PATCH /modules/:id:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.delete(`${BASE}/modules/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockModules.findIndex((m) => m.id === id);
      if (index === -1) return jsonResponse({ error: "Module not found" }, { status: 404 });

      mockModules.splice(index, 1);
      saveToStorage("mockModules", mockModules);

      return jsonResponse({ success: true });
    } catch (e: any) {
      console.error("MSW Error in DELETE /modules/:id:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  // --- CYCLES ---
  http.get(`${BASE}/cycles`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    return jsonResponse(mockCycles);
  }),

  http.post(`${BASE}/cycles`, async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const newCycle = {
        id: `c${Date.now()}`,
        project_id: body.project_id || "p1",
        name: body.name,
        description: body.description || "",
        start_date: body.start_date || "",
        end_date: body.end_date || "",
        progress: body.progress ?? 0,
      };

      mockCycles.push(newCycle);
      saveToStorage("mockCycles", mockCycles);

      return jsonResponse(newCycle, { status: 201 });
    } catch (e: any) {
      console.error("MSW Error in POST /cycles:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.get(`${BASE}/cycles/:id`, async ({ request, params }) => {
    const sessionId = getSessionId(request);
    if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    const cycle = mockCycles.find(c => c.id === params.id);
    if (!cycle) return jsonResponse({ error: "Cycle not found" }, { status: 404 });
    return jsonResponse(cycle);
  }),

  http.patch(`${BASE}/cycles/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as any;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockCycles.findIndex((c) => c.id === id);
      if (index === -1) return jsonResponse({ error: "Cycle not found" }, { status: 404 });

      mockCycles[index] = {
        ...mockCycles[index],
        ...body,
      };
      saveToStorage("mockCycles", mockCycles);

      return jsonResponse(mockCycles[index]);
    } catch (e: any) {
      console.error("MSW Error in PATCH /cycles/:id:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  http.delete(`${BASE}/cycles/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId) return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockCycles.findIndex((c) => c.id === id);
      if (index === -1) return jsonResponse({ error: "Cycle not found" }, { status: 404 });

      mockCycles.splice(index, 1);
      saveToStorage("mockCycles", mockCycles);

      return jsonResponse({ success: true });
    } catch (e: any) {
      console.error("MSW Error in DELETE /cycles/:id:", e);
      return jsonResponse({ error: String(e), stack: e.stack }, { status: 500 });
    }
  }),

  // ─── CÁC ISSUES HANDLERS ───

  // --- GET ALL ISSUES ---
  http.get(`${BASE}/issues`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId") || url.searchParams.get("project_id");

    const issues = projectId
      ? mockIssues.filter((issue) => issue.project_id === projectId)
      : mockIssues;

    return jsonResponse(issues);
  }),

  // --- GET COMMENTS BY ISSUE ID ---
  // Đưa handler này lên trước GET ISSUE BY ID để tránh xung đột định tuyến
  http.get(`${BASE}/issues/:id/comments`, async ({ params }) => {
    const issueId = params.id as string;

    const comments = mockComments.filter(
      (comment) => comment.issue_id === issueId
    );

    return jsonResponse(comments);
  }),

  // --- CREATE COMMENT ---
  http.post(`${BASE}/issues/:id/comments`, async ({ request, params }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const issueId = params.id as string;
    const body = (await request.json()) as { content: string };

    if (!body.content?.trim()) {
      return jsonResponse(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      issue_id: issueId,
      user_id: sessionId,
      content: body.content.trim(),
      created_at: new Date().toISOString(),
    };

    mockComments.push(newComment);
    saveToStorage("mockComments", mockComments);

    return jsonResponse(newComment, { status: 201 });
  }),

  // --- GET ISSUE BY ID ---
  http.get(`${BASE}/issues/:id`, async ({ request, params }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const issue = mockIssues.find((item) => item.id === params.id);

    if (!issue) {
      return jsonResponse(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    return jsonResponse(issue);
  }),
];
