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
  mockCommunityPosts,
  mockQuestions,
  User,
  Workspace,
  Project,
  Issue,
  Module,
  Member,
  Page,
  CustomView,
  Notification,
  CommunityPost,
  Question,
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
  status?: Module["status"];
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
  labels?: string[];
  start_date?: string | null;
  due_date?: string | null;
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
  name?: string;
  content?: string;
}

interface ViewPayload {
  name: string;
  filters?: Record<string, unknown>;
}

interface InboxPayload {
  is_read: boolean;
}

interface CommunityPostPayload {
  content: string;
  workspace_id?: string;
  author?: string;
  avatar?: string;
}

interface QuestionPayload {
  title: string;
  description: string;
  workspace_id?: string;
  author?: string;
  avatar?: string;
}
// ---------------------------------------

// Helper to wrap all JSON responses with CORS headers
function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  headers.set("Access-Control-Allow-Credentials", "true");
  return HttpResponse.json(body as any, { ...init, headers });
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

  http.get(`${BASE}/users`, async ({ request }) => {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const users = mockUsers.map(({ password, ...user }) => user);

    return jsonResponse(users);
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
        network: body.network === "private" ? "private" : "public",
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

      mockProjects[index] = {
        ...mockProjects[index],
        ...body,
        network: body.network === "private" ? "private" : (body.network === "public" ? "public" : mockProjects[index].network),
      } as Project;
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
        status: body.status ?? "Backlog",
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
          (body.priority as
            | "Urgent"
            | "High"
            | "Medium"
            | "Low"
            | "None") ?? "Low",
        assignee_id: body.assignee_id ?? null,
        module_id: body.module_id ?? null,
        cycle_id: body.cycle_id ?? null,
        labels: body.labels ?? [],
        start_date: body.start_date ?? "",
        due_date: body.due_date ?? "",
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
        state: (body.state === "Backlog" || body.state === "Todo" || body.state === "In Progress" || body.state === "Done" || body.state === "Cancelled"
          ? body.state
          : mockIssues[index].state) as "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled",
        priority: (body.priority === "Urgent" || body.priority === "High" || body.priority === "Medium" || body.priority === "Low" || body.priority === "None"
          ? body.priority
          : mockIssues[index].priority) as "Urgent" | "High" | "Medium" | "Low" | "None",
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

    const assignee = mockUsers.find((u) => u.id === issue.assignee_id);
    const project = mockProjects.find((p) => p.id === issue.project_id);
    const module = mockModules.find((m) => m.id === issue.module_id);
    const cycle = mockCycles.find((c) => c.id === issue.cycle_id);

    return jsonResponse({
      ...issue,
      assignee,
      project,
      module,
      cycle,
    });
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
          id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

  // Global members endpoints
  http.get(`${BASE}/members`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    return jsonResponse(mockMembers);
  }),

  http.post(`${BASE}/members`, async ({ request }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as MemberPayload;

      if (!body.email || !body.role)
        return jsonResponse({ error: "Email and role are required" }, { status: 400 });

      const duplicate = mockMembers.find((m) => m.email === body.email);
      if (duplicate)
        return jsonResponse({ error: "This email is already a member of the workspace" }, { status: 400 });

      const newMember: Member = {
        id: `mem-${Date.now()}`,
        workspace_id: mockWorkspaces[0]?.id ?? "w1",
        email: body.email,
        role: body.role,
        joined_at: new Date().toISOString(),
      };
      mockMembers.push(newMember);
      saveToStorage("mockMembers", mockMembers);

      return jsonResponse(newMember, { status: 201 });
    } catch (e: unknown) {
      return handleError(e, "POST /members");
    }
  }),

  http.delete(`${BASE}/members/:id`, async ({ request, params }) => {
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
      return handleError(e, "DELETE /members/:id");
    }
  }),

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

  http.get(
    `${BASE}/projects/:project_id/pages/:id`,
    async ({ request, params }) => {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const page = mockPages.find((p) => p.id === id);
      if (!page)
        return jsonResponse({ error: "Page not found" }, { status: 404 });

      return jsonResponse(page);
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
        if (!body.name?.trim())
          return jsonResponse({ error: "Page name is required" }, { status: 400 });

        const newPage: Page = {
          id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          project_id: project_id as string,
          name: body.name.trim(),
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

  http.patch(
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

        const body = (await request.json()) as PagePayload;
        if (!body.name?.trim() && body.content === undefined)
          return jsonResponse({ error: "At least one field (name or content) is required" }, { status: 400 });

        mockPages[index] = {
          ...mockPages[index],
          ...(body.name?.trim()        ? { name: body.name.trim() }  : {}),
          ...(body.content !== undefined ? { content: body.content } : {}),
          updated_at: new Date().toISOString(),
        };
        saveToStorage("mockPages", mockPages);

        return jsonResponse(mockPages[index]);
      } catch (e: unknown) {
        return handleError(e, "PATCH /pages/:id");
      }
    },
  ),

  // --- INBOX / NOTIFICATIONS (GET, PATCH read-all, PATCH :id/read, DELETE :id) ---

  http.get(`${BASE}/inbox`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    return jsonResponse(mockNotifications);
  }),

  http.patch(`${BASE}/inbox/read-all`, async ({ request }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      mockNotifications.forEach((n) => { n.is_read = true; });
      saveToStorage("mockNotifications", mockNotifications);
      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "PATCH /inbox/read-all");
    }
  }),

  http.patch(`${BASE}/inbox/:id/read`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockNotifications.findIndex((n) => n.id === id);
      if (index === -1)
        return jsonResponse({ error: "Not found" }, { status: 404 });

      mockNotifications[index].is_read = true;
      saveToStorage("mockNotifications", mockNotifications);
      return jsonResponse(mockNotifications[index]);
    } catch (e: unknown) {
      return handleError(e, "PATCH /inbox/:id/read");
    }
  }),

  http.delete(`${BASE}/inbox/:id`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockNotifications.findIndex((n) => n.id === id);
      if (index === -1)
        return jsonResponse({ error: "Not found" }, { status: 404 });

      mockNotifications.splice(index, 1);
      saveToStorage("mockNotifications", mockNotifications);
      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /inbox/:id");
    }
  }),

  // --- COMMUNITY (GET, POST, DELETE) ---
  http.get(`${BASE}/community`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    return jsonResponse(mockCommunityPosts);
  }),

  http.post(`${BASE}/community`, async ({ request }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as CommunityPostPayload;
      if (!body.content?.trim())
        return jsonResponse({ error: "Post content is required" }, { status: 400 });

      const currentUser = mockUsers.find((u) => u.id === sessionId);

      const newPost: CommunityPost = {
        id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        workspace_id: body.workspace_id || "w1",
        author: body.author || currentUser?.name || "Phước (Lead)",
        avatar: body.avatar || currentUser?.avatar || "https://i.pravatar.cc/150?u=u1",
        content: body.content.trim(),
        created_at: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
      };

      mockCommunityPosts.unshift(newPost);
      saveToStorage("mockCommunityPosts", mockCommunityPosts);
      return jsonResponse(newPost, { status: 201 });
    } catch (e: unknown) {
      return handleError(e, "POST /community");
    }
  }),

  http.patch(`${BASE}/community/:id/like`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockCommunityPosts.findIndex((p) => p.id === id);
      if (index === -1)
        return jsonResponse({ error: "Post not found" }, { status: 404 });

      const post = mockCommunityPosts[index];
      const newLiked = !post.liked;
      const newLikes = newLiked ? post.likes + 1 : Math.max(0, post.likes - 1);

      mockCommunityPosts[index] = {
        ...post,
        liked: newLiked,
        likes: newLikes,
      };

      saveToStorage("mockCommunityPosts", mockCommunityPosts);
      return jsonResponse(mockCommunityPosts[index]);
    } catch (e: unknown) {
      return handleError(e, "PATCH /community/:id/like");
    }
  }),

  http.post(`${BASE}/community/:id/comments`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockCommunityPosts.findIndex((p) => p.id === id);
      if (index === -1)
        return jsonResponse({ error: "Post not found" }, { status: 404 });

      const body = (await request.json()) as { content?: string; author?: string; avatar?: string };
      if (!body.content?.trim())
        return jsonResponse({ error: "Comment content is required" }, { status: 400 });

      const currentUser = mockUsers.find((u) => u.id === sessionId);

      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        author: body.author || currentUser?.name || "Phước (Lead)",
        avatar: body.avatar || currentUser?.avatar || "https://i.pravatar.cc/150?u=u1",
        content: body.content.trim(),
        created_at: new Date().toISOString(),
      };

      mockCommunityPosts[index].comments.push(newComment);
      saveToStorage("mockCommunityPosts", mockCommunityPosts);
      return jsonResponse(mockCommunityPosts[index], { status: 201 });
    } catch (e: unknown) {
      return handleError(e, "POST /community/:id/comments");
    }
  }),

  http.delete(
    `${BASE}/community/:id/comments/:commentId`,
    async ({ request, params }) => {
      try {
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const { id, commentId } = params;
        const postIndex = mockCommunityPosts.findIndex((p) => p.id === id);
        if (postIndex === -1)
          return jsonResponse({ error: "Post not found" }, { status: 404 });

        const commentIndex = mockCommunityPosts[postIndex].comments.findIndex(
          (c) => c.id === commentId
        );
        if (commentIndex === -1)
          return jsonResponse({ error: "Comment not found" }, { status: 404 });

        mockCommunityPosts[postIndex].comments.splice(commentIndex, 1);
        saveToStorage("mockCommunityPosts", mockCommunityPosts);
        return jsonResponse({ success: true });
      } catch (e: unknown) {
        return handleError(e, "DELETE /community/:id/comments/:commentId");
      }
    }
  ),

  http.delete(`${BASE}/community/:id`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockCommunityPosts.findIndex((p) => p.id === id);
      if (index === -1)
        return jsonResponse({ error: "Post not found" }, { status: 404 });

      mockCommunityPosts.splice(index, 1);
      saveToStorage("mockCommunityPosts", mockCommunityPosts);
      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /community/:id");
    }
  }),

  // --- QUESTIONS (GET, POST, DELETE) ---
  http.get(`${BASE}/questions`, async ({ request }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    return jsonResponse(mockQuestions);
  }),

  http.get(`${BASE}/questions/:id`, async ({ request, params }) => {
    const sessionId = getSessionId(request);
    if (!sessionId)
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const question = mockQuestions.find((q) => q.id === id);
    if (!question)
      return jsonResponse({ error: "Question not found" }, { status: 404 });

    return jsonResponse(question);
  }),

  http.post(`${BASE}/questions`, async ({ request }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const body = (await request.json()) as QuestionPayload;
      if (!body.title?.trim())
        return jsonResponse({ error: "Question title is required" }, { status: 400 });

      const currentUser = mockUsers.find((u) => u.id === sessionId);

      const newQuestion: Question = {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        workspace_id: body.workspace_id || "w1",
        title: body.title.trim(),
        description: body.description?.trim() || "",
        author: body.author || currentUser?.name || "Phước (Lead)",
        avatar: body.avatar || currentUser?.avatar || "https://i.pravatar.cc/150?u=u1",
        created_at: new Date().toISOString(),
        answers: [],
      };

      mockQuestions.unshift(newQuestion);
      saveToStorage("mockQuestions", mockQuestions);
      return jsonResponse(newQuestion, { status: 201 });
    } catch (e: unknown) {
      return handleError(e, "POST /questions");
    }
  }),

  http.post(`${BASE}/questions/:id/answers`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockQuestions.findIndex((q) => q.id === id);
      if (index === -1)
        return jsonResponse({ error: "Question not found" }, { status: 404 });

      const body = (await request.json()) as { content?: string; author?: string; avatar?: string };
      if (!body.content?.trim())
        return jsonResponse({ error: "Answer content is required" }, { status: 400 });

      const currentUser = mockUsers.find((u) => u.id === sessionId);

      const newAnswer = {
        id: `answer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        question_id: id as string,
        author: body.author || currentUser?.name || "Phước (Lead)",
        avatar: body.avatar || currentUser?.avatar || "https://i.pravatar.cc/150?u=u1",
        content: body.content.trim(),
        created_at: new Date().toISOString(),
      };

      if (!mockQuestions[index].answers) {
        mockQuestions[index].answers = [];
      }
      mockQuestions[index].answers.push(newAnswer);
      saveToStorage("mockQuestions", mockQuestions);
      return jsonResponse(mockQuestions[index], { status: 201 });
    } catch (e: unknown) {
      return handleError(e, "POST /questions/:id/answers");
    }
  }),

  http.delete(
    `${BASE}/questions/:id/answers/:answerId`,
    async ({ request, params }) => {
      try {
        const sessionId = getSessionId(request);
        if (!sessionId)
          return jsonResponse({ error: "Unauthorized" }, { status: 401 });

        const { id, answerId } = params;
        const qIndex = mockQuestions.findIndex((q) => q.id === id);
        if (qIndex === -1)
          return jsonResponse({ error: "Question not found" }, { status: 404 });

        const ansIndex = (mockQuestions[qIndex].answers || []).findIndex(
          (a) => a.id === answerId
        );
        if (ansIndex === -1)
          return jsonResponse({ error: "Answer not found" }, { status: 404 });

        mockQuestions[qIndex].answers.splice(ansIndex, 1);
        saveToStorage("mockQuestions", mockQuestions);
        return jsonResponse({ success: true });
      } catch (e: unknown) {
        return handleError(e, "DELETE /questions/:id/answers/:answerId");
      }
    }
  ),

  http.delete(`${BASE}/questions/:id`, async ({ request, params }) => {
    try {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

      const { id } = params;
      const index = mockQuestions.findIndex((q) => q.id === id);
      if (index === -1)
        return jsonResponse({ error: "Question not found" }, { status: 404 });

      mockQuestions.splice(index, 1);
      saveToStorage("mockQuestions", mockQuestions);
      return jsonResponse({ success: true });
    } catch (e: unknown) {
      return handleError(e, "DELETE /questions/:id");
    }
  }),

  // --- ANALYTICS (GET) ---
  http.get(
    `${BASE}/workspaces/:workspace_id/analytics`,
    async ({ request }) => {
      const sessionId = getSessionId(request);
      if (!sessionId)
        return jsonResponse({ error: "Unauthorized" }, { status: 401 });

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