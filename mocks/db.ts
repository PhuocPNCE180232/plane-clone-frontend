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

  state:
    | "Backlog"
    | "Todo"
    | "In Progress"
    | "Done"
    | "Cancelled";

  priority:
    | "Urgent"
    | "High"
    | "Medium"
    | "Low"
    | "None";

  assignee_id: string | null;
  module_id: string | null;
  cycle_id: string | null;

  labels?: string[];
  start_date?: string | null;
  due_date?: string | null;

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
  workspace_id: string;
  title: string;
  description: string;
  type: "issue" | "page" | "member" | "comment" | "cycle" | "module" | "project";
  is_read: boolean;
  created_at: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  workspace_id: string;
  author: string;
  avatar: string;
  content: string;
  created_at: string;
  likes: number;
  liked: boolean;
  comments: CommunityComment[];
}

export interface QuestionAnswer {
  id: string;
  question_id: string;
  author: string;
  avatar: string;
  content: string;
  created_at: string;
}

export interface Question {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  created_at: string;
  answers: QuestionAnswer[];
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
    labels: ["frontend", "setup"],
    start_date: "2026-07-03",
    due_date: "2026-07-06",
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
    labels: ["auth", "ui"],
    start_date: "2026-07-02",
    due_date: "2026-07-07",
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
    workspace_id: "w1",
    title: "Issue assigned",
    description: "John assigned FE-24 'Implement OAuth Login Flow' to you.",
    type: "issue",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
  },
  {
    id: "notif-2",
    workspace_id: "w1",
    title: "Comment added",
    description: "Emily commented on FE-17: 'Please check the design token references before merging.'",
    type: "comment",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
  },
  {
    id: "notif-3",
    workspace_id: "w1",
    title: "New page created",
    description: "API Documentation page was created by Alex in Plane Clone.",
    type: "page",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
  },
  {
    id: "notif-4",
    workspace_id: "w1",
    title: "Member joined",
    description: "David joined the workspace as a Developer.",
    type: "member",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
  },
  {
    id: "notif-5",
    workspace_id: "w1",
    title: "Issue completed",
    description: "FE-11 'Setup Tailwind CSS Config' was moved to Done by Phước.",
    type: "issue",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
  },
  {
    id: "notif-6",
    workspace_id: "w1",
    title: "Cycle started",
    description: "Sprint 12 'Core Kanban Features' has started.",
    type: "cycle",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "notif-7",
    workspace_id: "w1",
    title: "Module created",
    description: "Authentication module was created by Điền.",
    type: "module",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: "notif-8",
    workspace_id: "w1",
    title: "Page updated",
    description: "Deployment Guide page was updated by Trâm.",
    type: "page",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "notif-9",
    workspace_id: "w1",
    title: "You were mentioned",
    description: "Nghĩa mentioned you in a comment on FE-1: 'Can we confirm the API response spec?'",
    type: "comment",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: "notif-10",
    workspace_id: "w1",
    title: "Issue assigned",
    description: "Nhân assigned BE-8 'Setup PostgreSQL Schema' to you.",
    type: "issue",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: "notif-11",
    workspace_id: "w1",
    title: "Cycle completed",
    description: "Sprint 11 'Initial Setup & Auth' was completed.",
    type: "cycle",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
  },
  {
    id: "notif-12",
    workspace_id: "w1",
    title: "Module updated",
    description: "Payment module description was updated by Phước.",
    type: "module",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
  },
  {
    id: "notif-13",
    workspace_id: "w1",
    title: "Project archived",
    description: "Mobile App project was archived by Admin.",
    type: "project",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: "notif-14",
    workspace_id: "w1",
    title: "Member role updated",
    description: "Danh's role was updated to Admin in OJT Team Frontend.",
    type: "member",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: "notif-15",
    workspace_id: "w1",
    title: "Project restored",
    description: "Website project was restored from archive.",
    type: "project",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  },
  {
    id: "notif-16",
    workspace_id: "w1",
    title: "Issue priority updated",
    description: "FE-5 'Fix Responsive Layout' priority was raised to High.",
    type: "issue",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
  },
  {
    id: "notif-17",
    workspace_id: "w1",
    title: "Page deleted",
    description: "Old Specs page was removed by Trâm.",
    type: "page",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
  },
  {
    id: "notif-18",
    workspace_id: "w1",
    title: "Comment added",
    description: "Sarah commented on BE-3: 'All unit tests are now passing.'",
    type: "comment",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // last week (7 days)
  },
  {
    id: "notif-19",
    workspace_id: "w1",
    title: "Cycle created",
    description: "Sprint 10 'Kickoff & Wireframes' was created.",
    type: "cycle",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(), // 8 days ago
  },
  {
    id: "notif-20",
    workspace_id: "w1",
    title: "Project created",
    description: "Plane Clone project was initialized.",
    type: "project",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 216).toISOString(), // 9 days ago
  },
];

export let mockNotifications: Notification[] = loadFromStorage<Notification[]>(
  "mockNotifications",
  defaultNotifications,
);
if (isBrowser && mockNotifications.length < 15) {
  mockNotifications = defaultNotifications;
  saveToStorage("mockNotifications", defaultNotifications);
} else if (isBrowser) {
  saveToStorage("mockNotifications", mockNotifications);
}

// Bảng Community Posts
const defaultCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    workspace_id: "w1",
    author: "Phước (Lead)",
    avatar: "https://i.pravatar.cc/150?u=u1",
    content: "Just finished Phase 6 of the Pages feature! Content editing and PATCH persistence are now working smoothly.",
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    likes: 5,
    liked: true,
    comments: [
      {
        id: "c1-1",
        author: "Điền",
        avatar: "https://i.pravatar.cc/150?u=u2",
        content: "Nice work! Clean implementation.",
        created_at: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
      {
        id: "c1-2",
        author: "Trâm",
        avatar: "https://i.pravatar.cc/150?u=u6",
        content: "Awesome, testing it now!",
        created_at: new Date(Date.now() - 1000 * 30).toISOString(),
      },
    ],
  },
  {
    id: "post-2",
    workspace_id: "w1",
    author: "Điền",
    avatar: "https://i.pravatar.cc/150?u=u2",
    content: "Does anyone have experience with TanStack Query v5 optimistic updates for infinite lists?",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    likes: 3,
    liked: false,
    comments: [
      {
        id: "c2-1",
        author: "Danh",
        avatar: "https://i.pravatar.cc/150?u=u3",
        content: "Check the queryClient.setQueryData pattern in the docs.",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: "post-3",
    workspace_id: "w1",
    author: "Danh",
    avatar: "https://i.pravatar.cc/150?u=u3",
    content: "Inbox feature Phase 1 is fully functional! Checked with MSW mock handlers.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    likes: 8,
    liked: true,
    comments: [
      {
        id: "c3-1",
        author: "Nhân",
        avatar: "https://i.pravatar.cc/150?u=u4",
        content: "Looks good.",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: "c3-2",
        author: "Phước (Lead)",
        avatar: "https://i.pravatar.cc/150?u=u1",
        content: "Great improvement!",
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: "c3-3",
        author: "Nghĩa",
        avatar: "https://i.pravatar.cc/150?u=u5",
        content: "I'll check this.",
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ],
  },
  {
    id: "post-4",
    workspace_id: "w1",
    author: "Nhân",
    avatar: "https://i.pravatar.cc/150?u=u4",
    content: "MSW is awesome for mocking REST API responses without waiting for backend readiness.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    likes: 4,
    liked: false,
    comments: [],
  },
  {
    id: "post-5",
    workspace_id: "w1",
    author: "Nghĩa",
    avatar: "https://i.pravatar.cc/150?u=u5",
    content: "Working on the new Community discussion feed. Keeping it lightweight and clean!",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    likes: 6,
    liked: true,
    comments: [
      {
        id: "c5-1",
        author: "Đức",
        avatar: "https://i.pravatar.cc/150?u=u7",
        content: "Thanks!",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
  },
  {
    id: "post-6",
    workspace_id: "w1",
    author: "Trâm",
    avatar: "https://i.pravatar.cc/150?u=u6",
    content: "Hey team, don't copy Plane 1:1, remember to focus on core usability and clean UX.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likes: 7,
    liked: false,
    comments: [
      {
        id: "c6-1",
        author: "Phước (Lead)",
        avatar: "https://i.pravatar.cc/150?u=u1",
        content: "Totally agree.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  {
    id: "post-7",
    workspace_id: "w1",
    author: "Đức",
    avatar: "https://i.pravatar.cc/150?u=u7",
    content: "Sprint 12 cycle has started today. Check your assigned issues on the Kanban board.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    likes: 2,
    liked: false,
    comments: [],
  },
  {
    id: "post-8",
    workspace_id: "w1",
    author: "Phước (Lead)",
    avatar: "https://i.pravatar.cc/150?u=u1",
    content: "Just pushed the updated design tokens for dark mode and dynamic badge backgrounds.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
    likes: 4,
    liked: true,
    comments: [
      {
        id: "c8-1",
        author: "Điền",
        avatar: "https://i.pravatar.cc/150?u=u2",
        content: "Nice, the colors look much better now.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      },
    ],
  },
  {
    id: "post-9",
    workspace_id: "w1",
    author: "Điền",
    avatar: "https://i.pravatar.cc/150?u=u2",
    content: "Reminder: We have the weekly team sync tomorrow at 10 AM. Please update your issue statuses.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    likes: 1,
    liked: false,
    comments: [],
  },
  {
    id: "post-10",
    workspace_id: "w1",
    author: "Danh",
    avatar: "https://i.pravatar.cc/150?u=u3",
    content: "Cleaned up the MSW handlers for project and member management. All tests passing clean!",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    likes: 5,
    liked: true,
    comments: [
      {
        id: "c10-1",
        author: "Nhân",
        avatar: "https://i.pravatar.cc/150?u=u4",
        content: "Great work!",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
      },
    ],
  },
  {
    id: "post-11",
    workspace_id: "w1",
    author: "Nhân",
    avatar: "https://i.pravatar.cc/150?u=u4",
    content: "Drafting the project architecture guidelines for subagents and API service layer.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    likes: 3,
    liked: false,
    comments: [],
  },
  {
    id: "post-12",
    workspace_id: "w1",
    author: "Trâm",
    avatar: "https://i.pravatar.cc/150?u=u6",
    content: "Welcome everyone to the OJT Team Frontend Plane Clone workspace! Let's build a great app.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 1 week ago
    likes: 8,
    liked: true,
    comments: [
      {
        id: "c12-1",
        author: "Phước (Lead)",
        avatar: "https://i.pravatar.cc/150?u=u1",
        content: "Glad to be here!",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
      },
      {
        id: "c12-2",
        author: "Điền",
        avatar: "https://i.pravatar.cc/150?u=u2",
        content: "Let's do this!",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
      },
    ],
  },
];

const rawCommunityPosts = loadFromStorage<CommunityPost[]>(
  "mockCommunityPosts",
  defaultCommunityPosts,
);

const communityPostMap = new Map<string, CommunityPost>();

// 1. Populate default seed posts first
defaultCommunityPosts.forEach((post) => {
  if (post && post.id) {
    const commentMap = new Map<string, CommunityComment>();
    (post.comments || []).forEach((c) => {
      if (c && c.id) commentMap.set(c.id, c);
    });
    communityPostMap.set(post.id, {
      ...post,
      comments: Array.from(commentMap.values()),
    });
  }
});

// 2. Merge stored posts from localStorage, updating existing seed posts or adding user posts
if (Array.isArray(rawCommunityPosts)) {
  rawCommunityPosts.forEach((post) => {
    if (post && post.id) {
      const existing = communityPostMap.get(post.id);
      const commentMap = new Map<string, CommunityComment>();

      if (existing?.comments) {
        existing.comments.forEach((c) => {
          if (c && c.id) commentMap.set(c.id, c);
        });
      }
      if (post.comments) {
        post.comments.forEach((c) => {
          if (c && c.id) commentMap.set(c.id, c);
        });
      }

      communityPostMap.set(post.id, {
        ...existing,
        ...post,
        likes: post.likes ?? existing?.likes ?? 0,
        liked: post.liked ?? existing?.liked ?? false,
        comments: Array.from(commentMap.values()),
      });
    }
  });
}

export let mockCommunityPosts: CommunityPost[] = Array.from(
  communityPostMap.values(),
);

if (isBrowser) {
  saveToStorage("mockCommunityPosts", mockCommunityPosts);
}

// ─── BẢNG QUESTIONS (HỎI ĐÁP PHÁT TRIỂN PHẦN MỀM) ─────────────────────────

const defaultQuestions: Question[] = [
  {
    id: "q-1",
    workspace_id: "w1",
    title: "How to configure MSW v2 with Next.js App Router?",
    description: "Looking for best practices when initializing MSW worker and server handlers inside the App Router app folder.",
    author: "Phước (Lead)",
    avatar: "https://i.pravatar.cc/150?u=u1",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    answers: [
      {
        id: "ans-1-1",
        question_id: "q-1",
        author: "Điền",
        avatar: "https://i.pravatar.cc/150?u=u2",
        content: "Call worker.start({ onUnhandledRequest: 'bypass' }) in your client-side MSW component mounted inside layout.tsx.",
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        id: "ans-1-2",
        question_id: "q-1",
        author: "Danh",
        avatar: "https://i.pravatar.cc/150?u=u3",
        content: "Make sure you export HTTP request handlers using the new MSW v2 http object syntax.",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: "q-2",
    workspace_id: "w1",
    title: "What is the recommended TanStack Query v5 mutation invalidation pattern?",
    description: "Should we invalidate query keys inside onSuccess or onSettled callback when updating optimistic UI caches?",
    author: "Điền",
    avatar: "https://i.pravatar.cc/150?u=u2",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    answers: [
      {
        id: "ans-2-1",
        question_id: "q-2",
        author: "Phước (Lead)",
        avatar: "https://i.pravatar.cc/150?u=u1",
        content: "Use onSettled to ensure background invalidation happens whether the mutation succeeds or fails.",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: "q-3",
    workspace_id: "w1",
    title: "How to optimize Tailwind CSS bundle size in production?",
    description: "Our build bundle size increased after adding custom utilities. What are the best purge/content rules?",
    author: "Danh",
    avatar: "https://i.pravatar.cc/150?u=u3",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    answers: [],
  },
  {
    id: "q-4",
    workspace_id: "w1",
    title: "Best practice for handling global state with Zustand?",
    description: "How do you structure slice creators when scaling active workspace and user preference stores?",
    author: "Nhân",
    avatar: "https://i.pravatar.cc/150?u=u4",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    answers: [],
  },
  {
    id: "q-5",
    workspace_id: "w1",
    title: "How to handle dark mode tokens using CSS variables?",
    description: "What is the cleanest way to toggle color themes without causing flash of unstyled content (FOUC)?",
    author: "Nghĩa",
    avatar: "https://i.pravatar.cc/150?u=u5",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    answers: [],
  },
  {
    id: "q-6",
    workspace_id: "w1",
    title: "What is the difference between Server Actions and REST API Routes in Next.js?",
    description: "When building fullstack modules, when should we prefer Server Actions over REST endpoints?",
    author: "Trâm",
    avatar: "https://i.pravatar.cc/150?u=u6",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    answers: [],
  },
  {
    id: "q-7",
    workspace_id: "w1",
    title: "How to implement client-side optimistic UI updates cleanly?",
    description: "We want instant UI feedback for issue status moves before waiting for network latency response.",
    author: "Đức",
    avatar: "https://i.pravatar.cc/150?u=u7",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    answers: [],
  },
  {
    id: "q-8",
    workspace_id: "w1",
    title: "How to handle TypeScript strict mode for partial DTOs?",
    description: "What type utilities work best for optional PATCH payloads without allowing empty object payloads?",
    author: "Phước (Lead)",
    avatar: "https://i.pravatar.cc/150?u=u1",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    answers: [],
  },
  {
    id: "q-9",
    workspace_id: "w1",
    title: "What is the best strategy for local storage sync in web apps?",
    description: "How can we reliably merge default seed data with client localStorage entries on app version upgrades?",
    author: "Điền",
    avatar: "https://i.pravatar.cc/150?u=u2",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    answers: [],
  },
  {
    id: "q-10",
    workspace_id: "w1",
    title: "How to prevent re-render cascades in deeply nested React components?",
    description: "Looking for profiling advice on React.memo and useCallback usage for heavy list rendering.",
    author: "Danh",
    avatar: "https://i.pravatar.cc/150?u=u3",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    answers: [],
  },
  {
    id: "q-11",
    workspace_id: "w1",
    title: "How to setup Playwright end-to-end tests for MSW mocked endpoints?",
    description: "Can Playwright intercept requests using MSW handlers in headless browser mode?",
    author: "Nhân",
    avatar: "https://i.pravatar.cc/150?u=u4",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    answers: [],
  },
  {
    id: "q-12",
    workspace_id: "w1",
    title: "How to implement smooth drag-and-drop Kanban columns in Tailwind?",
    description: "What lightweight library works best with React 18 for drag and drop column sorting?",
    author: "Trâm",
    avatar: "https://i.pravatar.cc/150?u=u6",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
    answers: [],
  },
];

const rawQuestions = loadFromStorage<Question[]>(
  "mockQuestions",
  defaultQuestions,
);

const questionMap = new Map<string, Question>();

defaultQuestions.forEach((q) => {
  if (q && q.id) {
    const ansMap = new Map<string, QuestionAnswer>();
    (q.answers || []).forEach((ans) => {
      if (ans && ans.id) ansMap.set(ans.id, ans);
    });
    questionMap.set(q.id, {
      ...q,
      answers: Array.from(ansMap.values()),
    });
  }
});

if (Array.isArray(rawQuestions)) {
  rawQuestions.forEach((q) => {
    if (q && q.id) {
      const existing = questionMap.get(q.id);
      const ansMap   = new Map<string, QuestionAnswer>();

      if (existing?.answers) {
        existing.answers.forEach((ans) => {
          if (ans && ans.id) ansMap.set(ans.id, ans);
        });
      }
      if (q.answers) {
        q.answers.forEach((ans) => {
          if (ans && ans.id) ansMap.set(ans.id, ans);
        });
      }

      questionMap.set(q.id, {
        ...existing,
        ...q,
        answers: Array.from(ansMap.values()),
      });
    }
  });
}

export let mockQuestions: Question[] = Array.from(questionMap.values());

if (isBrowser) {
  saveToStorage("mockQuestions", mockQuestions);
}
