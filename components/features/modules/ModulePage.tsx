"use client";

import { useState } from "react";
import { ModuleHeader } from "./ModuleHeader";
import { ModuleToolbar } from "./ModuleToolbar";
import { ModuleGrid } from "./ModuleGrid";
import type { ModuleFilterStatus } from "@/lib/module-lifecycle";

type ModulePageProps = {
  projectId: string;
};

export const ModulePage = ({ projectId }: ModulePageProps) => {
  const [view, setView] = useState<"board" | "list">("board");
  const [sortKey, setSortKey] = useState<"name" | "progress" | "work_items" | "due_date">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<ModuleFilterStatus>("all");

  return (
    <>
      <ModuleHeader />
      <ModuleToolbar
        projectId={projectId}
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
        projectId={projectId}
        view={view}
        sortKey={sortKey}
        sortDirection={sortDirection}
        filterStatus={filterStatus}
      />
    </>
  );
};
