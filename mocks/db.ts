// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (INTERFACES)

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
  slug: string; // Tên viết liền không dấu, vd: "fpt-software"
  owner_id: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  identifier: string; // Mã dự án (vd: FE, BE)
  description: string;
}

export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description: string;
  state: 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Cancelled';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low' | 'None';
  assignee_id: string | null;
  module_id: string | null;
  cycle_id: string | null;
  created_at: string;
}

export interface Cycle {
  id: string;
  project_id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface Module {
  id: string;
  project_id: string;
  name: string;
  description: string;
}

// 2. KHỞI TẠO DỮ LIỆU MẪU (MOCK DATA)

const isBrowser = typeof window !== 'undefined';

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return defaultValue;
};

export const saveToStorage = (key: string, value: any) => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Bảng Users (7 anh em team Plane Clone)
const defaultUsers: User[] = [
  { id: 'u1', name: 'Phước (Lead)', email: 'phuoc@example.com', avatar: 'https://i.pravatar.cc/150?u=u1', password: 'password123' },
  { id: 'u2', name: 'Điền', email: 'dien@example.com', avatar: 'https://i.pravatar.cc/150?u=u2', password: 'password123' },
  { id: 'u3', name: 'Danh', email: 'danh@example.com', avatar: 'https://i.pravatar.cc/150?u=u3', password: 'password123' },
  { id: 'u4', name: 'Nhân', email: 'nhan@example.com', avatar: 'https://i.pravatar.cc/150?u=u4', password: 'password123' },
  { id: 'u5', name: 'Nghĩa', email: 'nghia@example.com', avatar: 'https://i.pravatar.cc/150?u=u5', password: 'password123' },
  { id: 'u6', name: 'Trâm', email: 'tram@example.com', avatar: 'https://i.pravatar.cc/150?u=u6', password: 'password123' },
  { id: 'u7', name: 'Đức', email: 'duc@example.com', avatar: 'https://i.pravatar.cc/150?u=u7', password: 'password123' },
];

// Load from storage, but fall back to default if stored data is missing password field (migration)
const storedUsers = loadFromStorage<User[]>('mockUsers', defaultUsers);
const needsMigration = storedUsers.some(u => !u.password);
export let mockUsers: User[] = needsMigration ? defaultUsers : storedUsers;
if (needsMigration && isBrowser) saveToStorage('mockUsers', defaultUsers);

// Bảng Workspaces
const defaultWorkspaces: Workspace[] = [
  { id: 'w1', name: 'OJT Team Frontend', slug: 'ojt-team-fe', owner_id: 'u1' }
];

export let mockWorkspaces: Workspace[] = loadFromStorage('mockWorkspaces', defaultWorkspaces);

// Bảng Projects
const defaultProjects: Project[] = [
  { 
    id: 'p1', 
    workspace_id: 'w1', 
    name: 'Plane Clone', 
    identifier: 'FE', 
    description: 'Dự án OJT 4 tuần clone Plane.so' 
  }
];

export let mockProjects: Project[] = loadFromStorage('mockProjects', defaultProjects);

// Bảng Modules
export const mockModules: Module[] = [
  { id: 'm1', project_id: 'p1', name: 'Auth & User', description: 'Tính năng đăng nhập và quản lý user' },
  { id: 'm2', project_id: 'p1', name: 'Core Features', description: 'Các tính năng Kanban, Issue' }
];

// Bảng Cycles
export const mockCycles: Cycle[] = [
  { id: 'c1', project_id: 'p1', name: 'Cycle 1: Tuần 1', start_date: '2026-06-29', end_date: '2026-07-05' },
  { id: 'c2', project_id: 'p1', name: 'Cycle 2: Tuần 2', start_date: '2026-07-06', end_date: '2026-07-12' }
];

// Bảng Issues
export const mockIssues: Issue[] = [
  {
    id: 'FE-1',
    project_id: 'p1',
    title: 'Bọc QueryClientProvider (TanStack Query)',
    description: 'Setup thư viện gọi API cho toàn app',
    state: 'Todo',
    priority: 'High',
    assignee_id: 'u2', // Giao cho Điền
    module_id: 'm2',
    cycle_id: 'c1',
    created_at: '2026-07-03T00:00:00Z'
  },
  {
    id: 'FE-2',
    project_id: 'p1',
    title: 'Dựng UI tĩnh - Form Login & Signup',
    description: 'Dựng giao diện đăng nhập',
    state: 'Backlog',
    priority: 'Medium',
    assignee_id: 'u4', // Giao cho Nhân
    module_id: 'm1',
    cycle_id: 'c1',
    created_at: '2026-07-03T00:00:00Z'
  }
];