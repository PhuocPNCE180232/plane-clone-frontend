import { del, get, post } from "@/lib/api/request";

export type ViewFilters = Record<string, unknown>;

export interface CustomView {
  id: string;
  project_id: string;
  name: string;
  filters: ViewFilters;
  created_at: string;
}

export type CreateCustomViewDto = {
  name: string;
  filters?: ViewFilters;
};

export const getProjectViews = (projectId: string): Promise<CustomView[]> =>
  get<CustomView[]>(`/projects/${projectId}/views`);

export const createProjectView = (
  projectId: string,
  data: CreateCustomViewDto,
): Promise<CustomView> =>
  post<CustomView, CreateCustomViewDto>(`/projects/${projectId}/views`, data);

export const deleteProjectView = (
  projectId: string,
  viewId: string,
): Promise<void> => del<void>(`/projects/${projectId}/views/${viewId}`);