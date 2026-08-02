"use client";

import { Boxes } from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import { useQuery } from "@tanstack/react-query";
import { getModules } from "@/lib/services/module.service";
import { mockIssues } from "@/mocks/db";

type SortKey = "name" | "progress" | "work_items" | "due_date";
type ModuleFilterStatus = "all" | "backlog" | "planned" | "in_progress" | "paused" | "completed" | "cancelled";

type ModuleGridProps = {
  view: "board" | "list";
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  filterStatus: ModuleFilterStatus;
};

const formatDateValue = (dateString?: string) =>
  dateString ? new Date(dateString).getTime() : Number.POSITIVE_INFINITY;

export const ModuleGrid = ({ view, sortKey, sortDirection, filterStatus }: ModuleGridProps) => {
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center shadow-sm">
        <Boxes className="mb-3 h-10 w-10 text-gray-200 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading Modules...</p>
      </div>
    );
  }

  const getModuleStatus = (module: { status?: string; progress?: number }) => {
    const explicitStatus = module.status?.trim();
    if (explicitStatus) {
      return explicitStatus.toLowerCase();
    }

    const progress = module.progress ?? 0;
    if (progress >= 100) return "completed";
    if (progress > 0) return "in_progress";
    return "backlog";
  };

  const filteredModules = modules.filter((module) => {
    if (filterStatus === "all") return true;
    return getModuleStatus(module) === filterStatus;
  });

  const sortedModules = [...filteredModules].sort((a, b) => {
    const compare = (left: number | string, right: number | string) => {
      if (left < right) return -1;
      if (left > right) return 1;
      return 0;
    };

    const workItems = (module: { id: string }) =>
      mockIssues.filter((issue) => issue.module_id === module.id).length;

    let result = 0;

    switch (sortKey) {
      case "name":
        result = compare(a.name.toLowerCase(), b.name.toLowerCase());
        break;
      case "progress":
        result = compare(a.progress ?? 0, b.progress ?? 0);
        break;
      case "work_items":
        result = compare(workItems(a), workItems(b));
        break;
      case "due_date":
        result = compare(formatDateValue(a.end_date), formatDateValue(b.end_date));
        break;
    }

    return sortDirection === "asc" ? result : -result;
  });

  if (modules.length === 0) {
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

  if (filteredModules.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
        <Boxes className="mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-600">No modules match this filter</p>
        <p className="mt-1 text-xs text-gray-400">Try choosing another status to view more modules.</p>
      </div>
    );
  }

  return (
    <section>
      {/* Section label — identical style to "All Projects" / "Active Cycles" */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        All Modules
      </h2>

      <div className={view === "board" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"}>
        {sortedModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
};
