import type { IssueProgress } from "@/lib/issue-progress";
import type { Module } from "@/lib/services/module.service";

export type ModuleLifecycleStatus = "upcoming" | "done";

export type ModuleFilterStatus = "all" | ModuleLifecycleStatus;

export const getModuleLifecycleStatus = (
  module: Module,
  progress: IssueProgress,
): ModuleLifecycleStatus => {
  const persistedStatus = module.status?.toLowerCase();

  if (
    persistedStatus === "completed" ||
    persistedStatus === "done" ||
    (progress.total > 0 && progress.percent === 100)
  ) {
    return "done";
  }

  return "upcoming";
};

export const getModuleLifecycleLabel = (
  status: ModuleLifecycleStatus,
) => (status === "done" ? "Done" : "Upcoming");

export const toPersistedModuleStatus = (
  status: ModuleLifecycleStatus,
): NonNullable<Module["status"]> =>
  status === "done" ? "Completed" : "Backlog";
