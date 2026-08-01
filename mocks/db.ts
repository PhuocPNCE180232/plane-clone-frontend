// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string; 
  owner_id: string;
  logo?: string; 
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  identifier: string; 
  description: string;
  createdAt?: string;
  network?: "public" | "private";
  status?: string;
}

export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description: string;
  state: "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";
  priority: "Urgent" | "High" | "Medium" | "Low" | "None";
  assignee_id: string | null;
  module_id: string | null;
  cycle_id: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Cycle {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  progress?: number; 
}

export interface Module {
  id: string;
  project_id: string;
  name: string;
  description: string;
  progress?: number; 
  status?: "Backlog" | "Planned" | "In Progress" | "Paused" | "Completed" | "Cancelled";
  start_date?: string;
  end_date?: string;
}

// ─── THÊM KIỂU DỮ LIỆU MỚI ───
export interface Member {
  id: string;
  workspace_id: string;
  email: string;
  role: string;
  joined_at: string;
}

export interface Page {
  id: string;
  project_id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CustomView {
  id: string;
  project_id: string;
  name: string;
  filters: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// 2. CÁC HÀM TRỢ GIÚP LƯU TRỮ

const isBrowser = typeof window !== "undefined";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) {
    return fallback;
  }

  const stored = localStorage.getItem(key);

  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export const saveToStorage = (key: string, value: any) => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// 3. KHỞI TẠO DỮ LIỆU MẪU

const defaultUsers: User[] = [
  {
    id: "u1",
    name: "Phước (Lead)",
    email: "phuoc@example.com",
    avatar: "https://i.pravatar.cc/150?u=u1",
    password: "password123",
  },
  {
    id: "u2",
    name: "Điền",
    email: "dien@example.com",
    avatar: "https://i.pravatar.cc/150?u=u2",
    password: "password123",
  },
  {
    id: "u3",
    name: "Danh",
    email: "danh@example.com",
    avatar: "https://i.pravatar.cc/150?u=u3",
    password: "password123",
  },
  {
    id: "u4",
    name: "Nhân",
    email: "nhan@example.com",
    avatar: "https://i.pravatar.cc/150?u=u4",
    password: "password123",
  },
  {
    id: "u5",
    name: "Nghĩa",
    email: "nghia@example.com",
    avatar: "https://i.pravatar.cc/150?u=u5",
    password: "password123",
  },
  {
    id: "u6",
    name: "Trâm",
    email: "tram@example.com",
    avatar: "https://i.pravatar.cc/150?u=u6",
    password: "password123",
  },
  {
    id: "u7",
    name: "Đức",
    email: "duc@example.com",
    avatar: "https://i.pravatar.cc/150?u=u7",
    password: "password123",
  },
];

const storedUsers = loadFromStorage<User[]>("mockUsers", defaultUsers);
const needsMigration = storedUsers.some((u) => !u.password);
export let mockUsers: User[] = needsMigration ? defaultUsers : storedUsers;
if (needsMigration && isBrowser) saveToStorage("mockUsers", defaultUsers);

// Bảng Workspaces
const defaultWorkspaces: Workspace[] = [
  {
    id: "w1",
    name: "OJT Team Frontend",
    slug: "ojt-team-fe",
    owner_id: "u1",
    logo: "🚀",
  },
];

let storedWorkspaces = loadFromStorage<Workspace[]>(
  "mockWorkspaces",
  defaultWorkspaces,
);

if (isBrowser) {
  let hasChanges = false;
  const seenSlugs = new Set();
  storedWorkspaces = storedWorkspaces.map((w) => {
    let slug = w.slug;
    let counter = 1;
    while (seenSlugs.has(slug)) {
      slug = `${w.slug}-${counter}`;
      counter++;
      hasChanges = true;
    }
    seenSlugs.add(slug);
    return { ...w, slug };
  });
  if (hasChanges) saveToStorage("mockWorkspaces", storedWorkspaces);
}

export let mockWorkspaces: Workspace[] = storedWorkspaces;

// Bảng Projects
const defaultProjects: Project[] = [
  {
    id: "p1",
    workspaceId: "w1",
    name: "Plane Clone",
    identifier: "FE",
    description: "Dự án OJT 4 tuần clone Plane.so",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    network: "public",
    status: "active",
  },
  {
    id: "p2",
    workspaceId: "w1",
    name: "Backend API",
    identifier: "BE",
    description: "Xây dựng API cho dự án",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    network: "private",
    status: "active",
  },
  {
    id: "p3",
    workspaceId: "w2",
    name: "Mobile App",
    identifier: "APP",
    description: "Phát triển ứng dụng di động",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    network: "public",
    status: "archived",
  },
];

let storedProjects = loadFromStorage<Project[]>(
  "mockProjects",
  defaultProjects,
);

if (storedProjects.length > 0) {
  // Fix missing fields for old mock data
  storedProjects = storedProjects.map((p) => ({
    ...p,
    createdAt: p.createdAt || new Date(Date.now() - 3600000 * 24).toISOString(),
    network: p.network || "public",
    status: p.status || "active",
  }));
  if (isBrowser) saveToStorage("mockProjects", storedProjects);
}

export let mockProjects: Project[] = storedProjects;

// Fix duplicate IDs caused by previous generation bug
if (isBrowser) {
  const uniqueProjects = new Map();
  mockProjects.forEach((p) => uniqueProjects.set(p.id, p));
  const deduplicated = Array.from(uniqueProjects.values());
  if (deduplicated.length !== mockProjects.length) {
    mockProjects = deduplicated;
    saveToStorage("mockProjects", mockProjects);
  }
}

if (mockProjects.length === 1 && mockProjects[0].id === "p1" && isBrowser) {
  mockProjects = defaultProjects;
  saveToStorage("mockProjects", defaultProjects);
}

// Bảng Modules
const defaultModules: Module[] = [
  {
    id: "m1",
    project_id: "p1",
    name: "Auth & User",
    description: "Tính năng đăng nhập và quản lý user",
    progress: 0,
    status: "Backlog",
    start_date: "2026-06-29",
    end_date: "2026-07-05",
  },
  {
    id: "m2",
    project_id: "p1",
    name: "Core Features",
    description: "Các tính năng Kanban, Issue",
    progress: 35,
    status: "In Progress",
    start_date: "2026-07-06",
    end_date: "2026-07-12",
  },
  {
    id: "m3",
    project_id: "p1",
    name: "UI Components",
    description: "Các thành phần giao diện",
    progress: 100,
    status: "Completed",
    start_date: "2026-06-15",
    end_date: "2026-06-30",
  },
];

let storedModules = loadFromStorage<Module[]>("mockModules", defaultModules);
export let mockModules: Module[] = storedModules;

if (isBrowser) {
  const uniqueModules = new Map<string, Module>();
  mockModules.forEach((module) => uniqueModules.set(module.id, module));
  mockModules = Array.from(uniqueModules.values());
  saveToStorage("mockModules", mockModules);
}

// Bảng Cycles
const defaultCycles: Cycle[] = [
  {
    id: "c1",
    project_id: "p1",
    name: "Cycle 1: Tuần 1",
    start_date: "2026-06-29",
    end_date: "2026-07-05",
    progress: 45,
  },
  {
    id: "c2",
    project_id: "p1",
    name: "Cycle 2: Tuần 2",
    start_date: "2026-07-06",
    end_date: "2026-07-12",
    progress: 20,
  },
];

let storedCycles = loadFromStorage<Cycle[]>("mockCycles", defaultCycles);
export let mockCycles: Cycle[] = storedCycles;

if (isBrowser) {
  const uniqueCycles = new Map<string, Cycle>();
  mockCycles.forEach((cycle) => uniqueCycles.set(cycle.id, cycle));
  mockCycles = Array.from(uniqueCycles.values());
  saveToStorage("mockCycles", mockCycles);
}

// Bảng Issues
const defaultIssues: Issue[] = [
  {
    id: "FE-1",
    project_id: "p1",
    title: "Bọc QueryClientProvider (TanStack Query)",
    description: "Setup thư viện gọi API cho toàn app",
    state: "Todo",
    priority: "High",
    assignee_id: "u2",
    module_id: "m2",
    cycle_id: "c1",
    created_at: "2026-07-03T00:00:00Z",
  },
  {
    id: "FE-2",
    project_id: "p1",
    title: "Dựng UI tĩnh - Form Login & Signup",
    description: "Dựng giao diện đăng nhập",
    state: "Backlog",
    priority: "Medium",
    assignee_id: "u4",
    module_id: "m1",
    cycle_id: "c1",
    created_at: "2026-07-03T00:00:00Z",
  },
];

const storedIssues = loadFromStorage<Issue[]>("mockIssues", defaultIssues);
const issueMap = new Map(storedIssues.map((issue) => [issue.id, issue]));

defaultIssues.forEach((issue) => {
  if (!issueMap.has(issue.id)) {
    issueMap.set(issue.id, issue);
  }
});

export let mockIssues: Issue[] = Array.from(issueMap.values());

if (isBrowser) {
  saveToStorage("mockIssues", mockIssues);
}

// Bảng Comments mẫu
const defaultComments: Comment[] = [
  {
    id: "comment-1",
    issue_id: "FE-1",
    user_id: "u1",
    content:
      "This looks good. What's the timeline for the backend implementation?",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-2",
    issue_id: "FE-1",
    user_id: "u2",
    content:
      "I've pushed a draft PR with the initial API spec. Please take a look and provide feedback.",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-3",
    issue_id: "FE-1",
    user_id: "u3",
    content:
      "I agree with this approach. We should also add proper error handling before merging.",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-4",
    issue_id: "FE-1",
    user_id: "u4",
    content:
      "The UI is looking clean so far. I think we can move forward with the current design.",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-5",
    issue_id: "FE-1",
    user_id: "u1",
    content:
      "Can we confirm the API response format before starting the integration?",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-6",
    issue_id: "FE-2",
    user_id: "u2",
    content: "I found a small issue when testing this flow on mobile devices.",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-7",
    issue_id: "FE-2",
    user_id: "u3",
    content:
      "Thanks for reporting this. I'll investigate and push a fix shortly.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-8",
    issue_id: "FE-2",
    user_id: "u4",
    content: "This should be fixed together with the next UI update.",
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-9",
    issue_id: "FE-2",
    user_id: "u1",
    content: "Do we have an estimated completion date for this issue?",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comment-10",
    issue_id: "FE-2",
    user_id: "u3",
    content:
      "The implementation is almost done. I just need to finish the final testing.",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

// Merge dữ liệu mẫu mới với dữ liệu đã lưu trong localStorage
const storedComments = loadFromStorage<Comment[]>("mockComments", []);

const commentMap = new Map(
  storedComments.map((comment) => [comment.id, comment]),
);

defaultComments.forEach((comment) => {
  if (!commentMap.has(comment.id)) {
    commentMap.set(comment.id, comment);
  }
});

export let mockComments: Comment[] = Array.from(commentMap.values());

if (isBrowser) {
  saveToStorage("mockComments", mockComments);
}

// ─── KHỞI TẠO MOCK DATA CHO GIAI ĐOẠN 2 ───

// Bảng Members
const defaultMembers: Member[] = [
  {
    id: "mem-1",
    workspace_id: "w1",
    email: "phuoc@example.com",
    role: "owner",
    joined_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: "mem-2",
    workspace_id: "w1",
    email: "nhan@example.com",
    role: "admin",
    joined_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: "mem-3",
    workspace_id: "w1",
    email: "tram@example.com",
    role: "member",
    joined_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
];
export let mockMembers: Member[] = loadFromStorage<Member[]>(
  "mockMembers",
  defaultMembers,
);
if (isBrowser) saveToStorage("mockMembers", mockMembers);

// Bảng Pages (Tài liệu Wiki)
const defaultPages: Page[] = [
  {
    id: "page-1",
    project_id: "p1",
    name: "Hướng dẫn cài đặt dự án",
    content:
      "<h1>Khởi chạy dự án</h1><p>Chạy lệnh npm install và npm run dev để khởi động.</p>",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
export let mockPages: Page[] = loadFromStorage<Page[]>(
  "mockPages",
  defaultPages,
);
if (isBrowser) saveToStorage("mockPages", mockPages);

// Bảng Custom Views
const defaultViews: CustomView[] = [
  {
    id: "view-1",
    project_id: "p1",
    name: "Tất cả Bug khẩn cấp",
    filters: { priority: "Urgent" },
    created_at: new Date().toISOString(),
  },
];
export let mockViews: CustomView[] = loadFromStorage<CustomView[]>(
  "mockViews",
  defaultViews,
);
if (isBrowser) saveToStorage("mockViews", mockViews);

// Bảng Notifications (Hộp thư Inbox)
const defaultNotifications: Notification[] = [
  {
    id: "notif-1",
    user_id: "u1",
    title: "Có người nhắc đến bạn",
    message: "Trâm đã nhắc đến bạn trong một comment ở task FE-1",
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "notif-2",
    user_id: "u1",
    title: "Task mới được giao",
    message: "Điền đã giao cho bạn task BE-5",
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];
export let mockNotifications: Notification[] = loadFromStorage<Notification[]>(
  "mockNotifications",
  defaultNotifications,
);
if (isBrowser) saveToStorage("mockNotifications", mockNotifications);
