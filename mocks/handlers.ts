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
import { mockUsers, mockWorkspaces, mockProjects, User, Workspace, Project, saveToStorage } from "./db";

export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Re-export http and HttpResponse so handler files don't need separate imports.
export { http, HttpResponse };

export const handlers: ReturnType<typeof http.all>[] = [
  // --- AUTH ---
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email } = body;
    const user = mockUsers.find((u) => u.email === email);
    
    if (!user) {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    return HttpResponse.json({ user, token: "mock_token_" + user.id }, {
      headers: {
        'Set-Cookie': `plane_session=${user.id}; Path=/; HttpOnly`,
      }
    });
  }),

  http.post(`${BASE}/auth/signup`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email, name } = body;
    
    const existing = mockUsers.find(u => u.email === email);
    if (existing) {
      return HttpResponse.json({ error: "Email already in use" }, { status: 400 });
    }



    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=u${mockUsers.length + 1}`,
    };
    mockUsers.push(newUser);
    saveToStorage('mockUsers', mockUsers);

    return HttpResponse.json({ user: newUser, token: "mock_token_" + newUser.id }, {
      headers: {
        'Set-Cookie': `plane_session=${newUser.id}; Path=/; HttpOnly`,
      }
    });
  }),

  http.get(`${BASE}/users/me`, async ({ request }) => {
    // Basic cookie parsing
    const cookieHeader = request.headers.get('Cookie');
    const sessionId = cookieHeader?.split('plane_session=')?.[1]?.split(';')?.[0];
    
    if (!sessionId) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = mockUsers.find(u => u.id === sessionId);
    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json({ user });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    return HttpResponse.json({ success: true }, {
      headers: {
        'Set-Cookie': `plane_session=; Path=/; HttpOnly; Max-Age=0`,
      }
    });
  }),

  // --- ONBOARDING (WORKSPACES & PROJECTS) ---
  http.post(`${BASE}/workspaces`, async ({ request }) => {
    const body = (await request.json()) as any;
    
    const cookieHeader = request.headers.get('Cookie');
    const sessionId = cookieHeader?.split('plane_session=')?.[1]?.split(';')?.[0];
    
    if (!sessionId) return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const newWorkspace: Workspace = {
      id: `w${mockWorkspaces.length + 1}`,
      name: body.name,
      slug: body.slug,
      owner_id: sessionId,
    };
    mockWorkspaces.push(newWorkspace);
    saveToStorage('mockWorkspaces', mockWorkspaces);

    return HttpResponse.json(newWorkspace, { status: 201 });
  }),

  http.post(`${BASE}/projects`, async ({ request }) => {
    const body = (await request.json()) as any;
    
    const cookieHeader = request.headers.get('Cookie');
    const sessionId = cookieHeader?.split('plane_session=')?.[1]?.split(';')?.[0];
    
    if (!sessionId) return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });

    const newProject: Project = {
      id: `p${mockProjects.length + 1}`,
      workspace_id: body.workspaceId || mockWorkspaces[0]?.id || 'w1', // fallback
      name: body.name,
      identifier: body.identifier,
      description: body.description || '',
    };
    mockProjects.push(newProject);
    saveToStorage('mockProjects', mockProjects);

    return HttpResponse.json(newProject, { status: 201 });
  })
];
