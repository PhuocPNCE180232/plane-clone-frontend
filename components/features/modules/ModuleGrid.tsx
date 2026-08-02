"use client";

import { useQuery } from "@tanstack/react-query";
import { Boxes } from "lucide-react";

import { useIssues } from "@/hooks/use-issues";
import { getIssueProgress, type IssueProgress } from "@/lib/issue-progress";
import {
  getModuleLifecycleStatus,
  type ModuleFilterStatus,
} from "@/lib/module-lifecycle";
import { getModules, type Module } from "@/lib/services/module.service";

import { ModuleCard } from "./ModuleCard";

type SortKey = "name" | "progress" | "work_items" | "due_date";

type ModuleGridProps = {
  projectId: string;
  view: "board" | "list";
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  filterStatus: ModuleFilterStatus;
};

const formatDateValue = (dateString?: string) =>
  dateString ? new Date(dateString).getTime() : Number.POSITIVE_INFINITY;

export const ModuleGrid = ({
  projectId,
  view,
  sortKey,
  sortDirection,
  filterStatus,
}: ModuleGridProps) => {
  const { data: modules = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ["modules", projectId],
    queryFn: () => getModules(projectId),
  });
  const { data: issues = [], isLoading: isIssuesLoading } = useIssues(projectId);

  const projectModules = modules.filter(
    (module) => module.project_id === projectId,
  );
  const issueProgressByModuleId = new Map<string, IssueProgress>(
    projectModules.map((module) => [
      module.id,
      getIssueProgress(
        issues.filter((issue) => issue.module_id === module.id),
      ),
    ]),
  );
  const getModuleProgress = (module: Module) =>
    issueProgressByModuleId.get(module.id) ?? getIssueProgress([]);

  const sortModules = (modulesToSort: Module[]) => {
    const compare = (left: number | string, right: number | string) => {
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    };

    return [...modulesToSort].sort((leftModule, rightModule) => {
      let result = 0;

      switch (sortKey) {
        case "name":
          result = compare(
            leftModule.name.toLowerCase(),
            rightModule.name.toLowerCase(),
          );
          break;
        case "progress":
          result = compare(
            getModuleProgress(leftModule).percent,
            getModuleProgress(rightModule).percent,
          );
          break;
        case "work_items":
          result = compare(
            getModuleProgress(leftModule).total,
            getModuleProgress(rightModule).total,
          );
          break;
        case "due_date":
          result = compare(
            formatDateValue(leftModule.end_date),
            formatDateValue(rightModule.end_date),
          );
          break;
      }

      return sortDirection === "asc" ? result : -result;
    });
  };

  const upcomingModules = sortModules(
    projectModules.filter(
      (module) =>
        getModuleLifecycleStatus(module, getModuleProgress(module)) ===
        "upcoming",
    ),
  );
  const doneModules = sortModules(
    projectModules.filter(
      (module) =>
        getModuleLifecycleStatus(module, getModuleProgress(module)) === "done",
    ),
  );

  const visibleModules =
    filterStatus === "upcoming"
      ? upcomingModules
      : filterStatus === "done"
        ? doneModules
        : [...upcomingModules, ...doneModules];

  if (isModulesLoading || isIssuesLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center shadow-sm">
        <Boxes className="mb-3 h-10 w-10 animate-spin text-gray-200" />
        <p className="text-sm font-medium text-gray-500">Loading Modules...</p>
      </div>
    );
  }

  if (projectModules.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center shadow-sm">
        <Boxes className="mb-3 h-10 w-10 text-gray-200" />
        <p className="text-sm font-medium text-gray-500">No Modules Yet</p>
        <p className="mt-1 max-w-xs text-xs text-gray-400">
          Create your first module to group and organise related issues together.
        </p>
      </div>
    );
  }

  if (visibleModules.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
        <Boxes className="mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-600">
          No modules match this status
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Try choosing another status to view more modules.
        </p>
      </div>
    );
  }

  const renderSection = (label: string, sectionModules: Module[]) => {
    if (sectionModules.length === 0) return null;

    return (
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </h2>
        <div
          className={
            view === "board"
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-3"
          }
        >
          {sectionModules.map((module) => (
            <ModuleCard key={module.id} module={module} issues={issues} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      {filterStatus !== "done" &&
        renderSection("Upcoming Modules", upcomingModules)}
      {filterStatus !== "upcoming" &&
        renderSection("Done Modules", doneModules)}
    </div>
  );
};
