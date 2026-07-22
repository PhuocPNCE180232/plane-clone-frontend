export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  identifier: string;
  description?: string;
  createdAt: string;
  network?: "public" | "private";
  status?: "active" | "archived";
}

export interface Issue {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  state: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  assigneeId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  createdAt: string;
}