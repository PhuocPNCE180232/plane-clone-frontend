import { get, post } from "@/lib/api/request";
import type { Comment } from "@/types";

export const getComments = (issueId: string) =>
  get<Comment[]>(`/issues/${issueId}/comments`);

export const createComment = (issueId: string, content: string) =>
  post<Comment, { content: string }>(
    `/issues/${issueId}/comments`,
    { content }
  );