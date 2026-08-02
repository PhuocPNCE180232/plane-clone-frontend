export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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
  state: "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";
  priority: "Urgent" | "High" | "Medium" | "Low" | "None";
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

export interface Member {
  id: string;
  workspace_id: string;
  email: string;
  /** "owner" | "admin" | "member" | "guest" — kept as string to match mocks/db.ts */
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

export interface Notification {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  type:
    | "issue"
    | "page"
    | "member"
    | "comment"
    | "cycle"
    | "module"
    | "project";
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
