export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string; // VD: 'fe-ojt-team'
  ownerId: string; // Liên kết với User.id
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string; // Liên kết với Workspace.id
  name: string;
  identifier: string; // Mã project (VD: FE, BE)
  description?: string;
}

export interface Issue {
  id: string;
  projectId: string; // Liên kết với Project.id
  title: string;
  description?: string;
  state: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  assigneeId?: string | null; // Liên kết với User.id
  startDate?: string | null;
  dueDate?: string | null;
  createdAt: string;
}

// Bổ sung thêm Cycles, Modules vào đây sau...