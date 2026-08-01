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
  logo?: string;
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
  project_id: string;
  projectId?: string;
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
  assigneeId?: string | null;
  module_id: string | null;
  moduleId?: string | null;
  cycle_id: string | null;
  cycleId?: string | null;

  created_at: string;
  createdAt?: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  created_at: string;
}