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
  // --- BỔ SUNG IMPORTS ---
  mockMembers,
  mockPages,
  mockViews,
  mockNotifications,
  User,
  Workspace,
  Project,
  Module,
  Member,
  Page,
  CustomView,
  Notification,
  // -----------------------------------
  saveToStorage,
} from "./db";

export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

// TYPE / INTERFACE

interface LoginPayload {
  email?: string;
  password?: string;
}

interface SignupPayload {
  email: string;
  name?: string;
  password?: string;
}

interface WorkspacePayload {
  name: string;
  slug: string;
  logo?: string;
}

interface ProjectPayload {
  workspaceId?: string;
  name: string;
  identifier: string;
  description?: string;
  network?: string;
}

interface ModulePayload {
  project_id?: string;
  name: string;
  description?: string;
  progress?: number;
}

interface CyclePayload {
  project_id?: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  progress?: number;
}

interface IssuePayload {
  project_id?: string;
  title: string;
  description?: string;
  state?: string;
  priority?: string;
  assignee_id?: string | null;
  module_id?: string | null;
  cycle_id?: string | null;
}

interface CommentPayload {
  content: string;
}

// --- BỔ SUNG INTERFACES CHO PHASE 2 ---
interface UserSettingsPayload {
  theme?: string;
  language?: string;
}

interface MemberPayload {
  email: string;
  role: string;
}

interface PagePayload {
  name: string;
  content?: string;
}

interface ViewPayload {
  name: string;
  filters?: Record<string, unknown>;
}

interface InboxPayload {
  is_read: boolean;
}
// ---------------------------------------

// Helper to wrap all JSON responses with CORS headers
function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  headers.set("Access-Control-Allow-Credentials", "true");
  return HttpResponse.json(body, { ...init, headers });
}

// Helper to handle errors safely without 'any'
function handleError(e: unknown, context: string) {
  const err = e instanceof Error ? e : new Error(String(e));
  console.error(`MSW Error in ${context}:`, err);
  return jsonResponse(
    { error: err.message, stack: err.stack },
    { status: 500 },
  );
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
    const body = (await request.json()) as LoginPayload;
    const { email, password } = body;

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return jsonResponse({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.password && user.password !== password) {
      return jsonResponse({ error: "Invalid credentials" }, { status: 401 });
    }

    return jsonResponse(
      { user, token: "mock_token_" + user.id },
      {
        headers: {
          "Set-Cookie": `plane_session=${user.id}; Path=/; HttpOnly`,
        },
      },
    );
  }),

  http.post(`${BASE}/auth/signup`, async ({ request }) => {
    const body = (await request.json()) as SignupPayload;
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

    return jsonResponse(
      { user: newUser, token: "mock_token_" + newUser.id },
      {
        headers: {
          "Set-Cookie": `plane_session=${newUser.id}; Path=/; HttpOnly`,
        },
      },
    );
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

    const { password, ...safeUser } = user;

    return jsonResponse({ user: safeUser });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    return jsonResponse(
      { success: true },
      {
        headers: {
          "Set-Cookie": `plane_session=; Path=/; HttpOnly; Max-Age=0`,
        },
      },
    );
  }),

  // --- ONBOARDING (WORKSPACES & PROJECTS) ---
  http.get(`${BASE}/workspaces`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    return jsonResponse(mockWorkspaces);
  }),

  http.post(`${BASE}/workspaces`, async ({ request }) => {
    try {
      const body = (await request.json()) as WorkspacePayload;
      const sessionId = getSessionId(request);

      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const existing = mockWorkspaces.find((w) => w.slug === body.slug);
      if (existing) {
        return jsonResponse(
          { error: "Workspace URL is already taken" },
          { status: 400 },
        );
      }

      const newWorkspace: Workspace = {
        id: `w${Date.now()}`,
        name: body.name,
        slug: body.slug,
        owner_id: sessionId,
        logo: body.logo || "",
      };
      mockWorkspaces.push(newWorkspace);
      saveToStorage("mockWorkspaces", mockWorkspaces);

      return jsonResponse(newWorkspace, { status: 201 });
    } catch (e: unknown) {
      return handleError(e, "POST /workspaces");
    }
  }),

  http.patch(`${BASE}/workspaces/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as Partial<WorkspacePayload>;
      const index = mockWorkspaces.findIndex((w) => w.id === id);
      if (index === -1)
        return jsonResponse({ error: "Workspace not found" }, { status: 404 });

      mockWorkspaces[index] = { ...mockWorkspaces[index], ...body };
      saveToStorage("mockWorkspaces", mockWorkspaces);

      return jsonResponse(mockWorkspaces[index]);
    } catch (e: unknown) {
      return handleError(e, "PATCH /workspaces");
    }
  }),

  http.delete(`${BASE}/workspaces/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockWorkspaces.findIndex((w) => w.id === id);
      if (index === -1)
        return jsonResponse({ error: "Workspace not found" }, { status: 404 });

      mockWorkspaces.splice(index, 1);
      saveToStorage("mockWorkspaces", mockWorkspaces);

      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /workspaces");
    }
  }),

  http.get(`${BASE}/projects`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    return jsonResponse(mockProjects);
  }),

  http.post(`${BASE}/projects`, async ({ request }) => {
    try {
      const body = (await request.json()) as ProjectPayload;
      const sessionId = getSessionId(request);

      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

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
    } catch (e: unknown) {
      return handleError(e, "POST /projects");
    }
  }),

  http.patch(`${BASE}/projects/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as Partial<ProjectPayload>;
      const index = mockProjects.findIndex((p) => p.id === id);
      if (index === -1)
        return jsonResponse({ error: "Project not found" }, { status: 404 });

      mockProjects[index] = { ...mockProjects[index], ...body };
      saveToStorage("mockProjects", mockProjects);

      return jsonResponse(mockProjects[index]);
    } catch (e: unknown) {
      return handleError(e, "PATCH /projects");
    }
  }),

  http.delete(`${BASE}/projects/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockProjects.findIndex((p) => p.id === id);
      if (index === -1)
        return jsonResponse({ error: "Project not found" }, { status: 404 });

      mockProjects.splice(index, 1);
      saveToStorage("mockProjects", mockProjects);

      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /projects");
    }
  }),

  // --- MODULES ---
  http.get(`${BASE}/modules`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    return jsonResponse(mockModules);
  }),

  http.post(`${BASE}/modules`, async ({ request }) => {
    try {
      const body = (await request.json()) as ModulePayload;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

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
    } catch (e: unknown) {
      return handleError(e, "POST /modules");
    }
  }),

  http.get(`${BASE}/modules/:id`, async ({ request, params }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    const moduleItem = mockModules.find((m) => m.id === params.id);
    if (!moduleItem)
      return jsonResponse({ error: "Module not found" }, { status: 404 });
    return jsonResponse(moduleItem);
  }),

  http.patch(`${BASE}/modules/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as Partial<ModulePayload>;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockModules.findIndex((m) => m.id === id);
      if (index === -1)
        return jsonResponse({ error: "Module not found" }, { status: 404 });

      mockModules[index] = {
        ...mockModules[index],
        ...body,
      };
      saveToStorage("mockModules", mockModules);

      return jsonResponse(mockModules[index]);
    } catch (e: unknown) {
      return handleError(e, "PATCH /modules");
    }
  }),

  http.delete(`${BASE}/modules/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockModules.findIndex((m) => m.id === id);
      if (index === -1)
        return jsonResponse({ error: "Module not found" }, { status: 404 });

      mockModules.splice(index, 1);
      saveToStorage("mockModules", mockModules);

      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /modules");
    }
  }),

  // --- CYCLES ---
  http.get(`${BASE}/cycles`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    return jsonResponse(mockCycles);
  }),

  http.post(`${BASE}/cycles`, async ({ request }) => {
    try {
      const body = (await request.json()) as CyclePayload;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

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
    } catch (e: unknown) {
      return handleError(e, "POST /cycles");
    }
  }),

  http.get(`${BASE}/cycles/:id`, async ({ request, params }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    const cycle = mockCycles.find((c) => c.id === params.id);
    if (!cycle)
      return jsonResponse({ error: "Cycle not found" }, { status: 404 });
    return jsonResponse(cycle);
  }),

  http.patch(`${BASE}/cycles/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as Partial<CyclePayload>;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockCycles.findIndex((c) => c.id === id);
      if (index === -1)
        return jsonResponse({ error: "Cycle not found" }, { status: 404 });

      mockCycles[index] = {
        ...mockCycles[index],
        ...body,
      };
      saveToStorage("mockCycles", mockCycles);

      return jsonResponse(mockCycles[index]);
    } catch (e: unknown) {
      return handleError(e, "PATCH /cycles");
    }
  }),

  http.delete(`${BASE}/cycles/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockCycles.findIndex((c) => c.id === id);
      if (index === -1)
        return jsonResponse({ error: "Cycle not found" }, { status: 404 });

      mockCycles.splice(index, 1);
      saveToStorage("mockCycles", mockCycles);

      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /cycles");
    }
  }),

  // --- ISSUES HANDLERS ---

  // --- CREATE ISSUE (POST) ---
  http.post(`${BASE}/issues`, async ({ request }) => {
    try {
      const body = (await request.json()) as IssuePayload;
      const sessionId = getSessionId(request);

      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      // Tìm số FE lớn nhất hiện có
      const maxIssueNumber = Math.max(
        0,
        ...mockIssues.map((issue) => {
          const match = issue.id.match(/^FE-(\d+)$/);
          return match ? Number(match[1]) : 0;
        }),
      );

      const nextIssueNumber = maxIssueNumber + 1;

      const newIssue = {
        id: `FE-${nextIssueNumber}`,
        project_id: body.project_id || "p1",
        title: body.title,
        description: body.description ?? "",
        state:
          (body.state as
            | "Backlog"
            | "Todo"
            | "In Progress"
            | "Done"
            | "Cancelled") ?? "Todo",
        priority:
          (body.priority as "Urgent" | "High" | "Medium" | "Low" | "None") ??
          "Low",
        assignee_id: body.assignee_id ?? null,
        module_id: body.module_id ?? null,
        cycle_id: body.cycle_id ?? null,
        created_at: new Date().toISOString(),
      };

      mockIssues.push(newIssue);
      saveToStorage("mockIssues", [...mockIssues]);
      return jsonResponse(JSON.parse(JSON.stringify(newIssue)), {
        status: 201,
      });
    } catch (e: unknown) {
      return handleError(e, "POST /issues");
    }
  }),

  // --- UPDATE ISSUE (PATCH) ---
  http.patch(`${BASE}/issues/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const body = (await request.json()) as Partial<IssuePayload>;
      const sessionId = getSessionId(request);

      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockIssues.findIndex((i) => i.id === id);
      if (index === -1)
        return jsonResponse({ error: "Issue not found" }, { status: 404 });

      mockIssues[index] = {
        ...mockIssues[index],
        ...body,
      };
      saveToStorage("mockIssues", [...mockIssues]);
      return jsonResponse(JSON.parse(JSON.stringify(mockIssues[index])));
    } catch (e: unknown) {
      return handleError(e, "PATCH /issues");
    }
  }),

  // --- DELETE ISSUE (DELETE) ---
  http.delete(`${BASE}/issues/:id`, async ({ request, params }) => {
    try {
      const { id } = params;
      const sessionId = getSessionId(request);

      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const index = mockIssues.findIndex((i) => i.id === id);
      if (index === -1)
        return jsonResponse({ error: "Issue not found" }, { status: 404 });

      mockIssues.splice(index, 1);
      saveToStorage("mockIssues", [...mockIssues]);
      return jsonResponse(JSON.parse(JSON.stringify({ success: true })));
    } catch (e: unknown) {
      return handleError(e, "DELETE /issues");
    }
  }),

  // --- GET ALL ISSUES ---
  http.get(`${BASE}/issues`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const projectId =
      url.searchParams.get("projectId") || url.searchParams.get("project_id");

    const issues = projectId
      ? mockIssues.filter((issue) => issue.project_id === projectId)
      : mockIssues;

    return jsonResponse(JSON.parse(JSON.stringify(issues)));
  }),

  // --- GET COMMENTS BY ISSUE ID ---
  http.get(`${BASE}/issues/:id/comments`, async ({ params }) => {
    const issueId = params.id as string;

    const comments = mockComments.filter(
      (comment) => comment.issue_id === issueId,
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
    const body = (await request.json()) as CommentPayload;

    if (!body.content?.trim()) {
      return jsonResponse(
        { error: "Comment content is required" },
        { status: 400 },
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
      return jsonResponse({ error: "Issue not found" }, { status: 404 });
    }

    return jsonResponse(issue);
  }),

  // ─── GIAI ĐOẠN 2: SETTINGS, MEMBERS, PAGES, INBOX, ANALYTICS ───

  // --- UPDATE PROFILE (PATCH) ---
  http.patch(`${BASE}/users/me`, async ({ request }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as Partial<User>;
      
      const userIndex = mockUsers.findIndex(u => u.id === sessionId);
      if (userIndex === -1) {
        return jsonResponse({ error: "User not found" }, { status: 404 });
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...body,
      };

      saveToStorage("mockUsers", mockUsers);

      return jsonResponse({
        user: mockUsers[userIndex],
      });
    } catch (e: unknown) {
      return handleError(e, "PATCH /users/me");
    }
  }),

  // --- ACCOUNT SETTINGS (PATCH) ---
  http.patch(`${BASE}/users/me/settings`, async ({ request }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as UserSettingsPayload;
      // Trả về data ảo báo thành công để Nhân (Frontend) làm UI
      return jsonResponse({
        success: true,
        message: "Settings updated",
        data: body,
      });
    } catch (e: unknown) {
      return handleError(e, "PATCH /users/me/settings");
    }
  }),

  // --- MEMBERS (GET, POST, DELETE) ---
  http.get(
    `${BASE}/workspaces/:workspace_id/members`,
    async ({ request, params }) => {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { workspace_id } = params;
      const members = mockMembers.filter(
        (m) => m.workspace_id === workspace_id,
      );
      return jsonResponse(members);
    },
  ),

  http.post(
    `${BASE}/workspaces/:workspace_id/members`,
    async ({ request, params }) => {
      try {
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const { workspace_id } = params;
        const body = (await request.json()) as MemberPayload;

        const newMember: Member = {
          id: `mem-${Date.now()}`,
          workspace_id: workspace_id as string,
          email: body.email,
          role: body.role || "member",
          joined_at: new Date().toISOString(),
        };

        mockMembers.push(newMember);
        saveToStorage("mockMembers", mockMembers);
        return jsonResponse(newMember, { status: 201 });
      } catch (e: unknown) {
        return handleError(e, "POST /members");
      }
    },
  ),

  http.delete(
    `${BASE}/workspaces/:workspace_id/members/:id`,
    async ({ request, params }) => {
      try {
        const { id } = params;
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const index = mockMembers.findIndex((m) => m.id === id);
        if (index === -1)
          return jsonResponse({ error: "Member not found" }, { status: 404 });

        mockMembers.splice(index, 1);
        saveToStorage("mockMembers", mockMembers);
        return jsonResponse({ success: true });
      } catch (e: unknown) {
        return handleError(e, "DELETE /members");
      }
    },
  ),

  // --- PAGES / WIKI (GET, POST, DELETE) ---
  http.get(
    `${BASE}/projects/:project_id/pages`,
    async ({ request, params }) => {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { project_id } = params;
      const pages = mockPages.filter((p) => p.project_id === project_id);
      return jsonResponse(pages);
    },
  ),

  http.post(
    `${BASE}/projects/:project_id/pages`,
    async ({ request, params }) => {
      try {
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const { project_id } = params;
        const body = (await request.json()) as PagePayload;

        const newPage: Page = {
          id: `page-${Date.now()}`,
          project_id: project_id as string,
          name: body.name,
          content: body.content || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        mockPages.push(newPage);
        saveToStorage("mockPages", mockPages);
        return jsonResponse(newPage, { status: 201 });
      } catch (e: unknown) {
        return handleError(e, "POST /pages");
      }
    },
  ),

  http.delete(
    `${BASE}/projects/:project_id/pages/:id`,
    async ({ request, params }) => {
      try {
        const { id } = params;
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const index = mockPages.findIndex((p) => p.id === id);
        if (index === -1)
          return jsonResponse({ error: "Page not found" }, { status: 404 });

        mockPages.splice(index, 1);
        saveToStorage("mockPages", mockPages);
        return jsonResponse({ success: true });
      } catch (e: unknown) {
        return handleError(e, "DELETE /pages");
      }
    },
  ),

  // --- INBOX / NOTIFICATIONS (GET, PATCH) ---
  http.get(`${BASE}/inbox`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    // Trả về noti của user hiện tại
    const userNotifs = mockNotifications.filter((n) => n.user_id === sessionId);
    return jsonResponse(userNotifs);
  }),

  http.patch(`${BASE}/inbox/:id`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const body = (await request.json()) as InboxPayload;

      const index = mockNotifications.findIndex((n) => n.id === id);
      if (index > -1) {
        mockNotifications[index].is_read = body.is_read;
        saveToStorage("mockNotifications", mockNotifications);
        return jsonResponse(mockNotifications[index]);
      }
      return jsonResponse({ error: "Not found" }, { status: 404 });
    } catch (e: unknown) {
      return handleError(e, "PATCH /inbox");
    }
  }),

  // --- ANALYTICS (GET) ---
  http.get(
    `${BASE}/workspaces/:workspace_id/analytics`,
    async ({ request }) => {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      // Fake data cho Điền vẽ biểu đồ
      const fakeAnalytics = {
        total_issues: mockIssues.length,
        completed_issues: mockIssues.filter((i) => i.state === "Done").length,
        in_progress_issues: mockIssues.filter((i) => i.state === "In Progress")
          .length,
        todo_issues: mockIssues.filter((i) => i.state === "Todo").length,
      };
      return jsonResponse(fakeAnalytics);
    },
  ),

  // --- CUSTOM VIEWS (GET, POST, DELETE) ---
  http.get(
    `${BASE}/projects/:project_id/views`,
    async ({ request, params }) => {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { project_id } = params;
      const views = mockViews.filter((v) => v.project_id === project_id);
      return jsonResponse(views);
    },
  ),

  http.post(
    `${BASE}/projects/:project_id/views`,
    async ({ request, params }) => {
      try {
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const { project_id } = params;
        const body = (await request.json()) as ViewPayload;

        const newView: CustomView = {
          id: `view-${Date.now()}`,
          project_id: project_id as string,
          name: body.name,
          filters: body.filters || {},
          created_at: new Date().toISOString(),
        };

        mockViews.push(newView);
        saveToStorage("mockViews", mockViews);
        return jsonResponse(newView, { status: 201 });
      } catch (e: unknown) {
        return handleError(e, "POST /views");
      }
    },
  ),

  http.delete(
    `${BASE}/projects/:project_id/views/:id`,
    async ({ request, params }) => {
      try {
        const { id } = params;
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const index = mockViews.findIndex((v) => v.id === id);
        if (index === -1)
          return jsonResponse({ error: "View not found" }, { status: 404 });

        mockViews.splice(index, 1);
        saveToStorage("mockViews", mockViews);
        return jsonResponse({ success: true });
      } catch (e: unknown) {
        return handleError(e, "DELETE /views");
      }
    },
  ),
];
