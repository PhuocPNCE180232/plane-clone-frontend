"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ModuleHeader } from "./ModuleHeader";
import { ModuleToolbar } from "./ModuleToolbar";
import { ModuleGrid } from "./ModuleGrid";

type ModuleFilterStatus = "all" | "backlog" | "planned" | "in_progress" | "paused" | "completed" | "cancelled";

export const ModulePage = () => {
  const [view, setView] = useState<"board" | "list">("board");
  const [sortKey, setSortKey] = useState<"name" | "progress" | "work_items" | "due_date">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<ModuleFilterStatus>("all");

  return (
    <>
      {/* Breadcrumb — same pattern as CyclePage, IssuePage, ProjectPage */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Plane Clone
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">Modules</span>
      </div>

      <ModuleHeader />
      <ModuleToolbar
        view={view}
        setView={setView}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <ModuleGrid
        view={view}
        sortKey={sortKey}
        sortDirection={sortDirection}
        filterStatus={filterStatus}
      />
    </>
  );
};
