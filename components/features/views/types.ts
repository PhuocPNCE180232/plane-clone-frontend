import type { Issue } from "@/types";

export type ViewMode = "list" | "board" | "calendar" | "timeline";

export type IssueStateFilter = "all" | Issue["state"];

export type IssuePriorityFilter = "all" | Issue["priority"];

export interface DisplayOptions {
  showProject: boolean;
  showPriority: boolean;
  showCreatedDate: boolean;
}

export type WorkspaceProjectMap = Map<
  string,
  {
    name: string;
    identifier: string;
  }
>;
