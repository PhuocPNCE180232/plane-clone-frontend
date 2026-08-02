import type { Issue } from "@/types";

export type ViewMode = "list" | "board" | "calendar" | "timeline";

export type ViewAccess = "private" | "workspace";

export type IssueStateFilter = "all" | Issue["state"];

export type IssuePriorityFilter = "all" | Issue["priority"];

export interface DisplayOptions {
  showProject: boolean;
  showPriority: boolean;
  showCreatedDate: boolean;
}

export interface SavedView {
  id: string;
  name: string;
  description: string;
  mode: ViewMode;
  access: ViewAccess;
  searchQuery: string;
  stateFilter: IssueStateFilter;
  priorityFilter: IssuePriorityFilter;
  displayOptions: DisplayOptions;
  createdAt: string;
}

export interface AddViewDraft {
  name: string;
  description: string;
  mode: ViewMode;
  access: ViewAccess;
  searchQuery: string;
  stateFilter: IssueStateFilter;
  priorityFilter: IssuePriorityFilter;
  displayOptions: DisplayOptions;
}

export type WorkspaceProjectMap = Map<
  string,
  {
    name: string;
    identifier: string;
  }
>;