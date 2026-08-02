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