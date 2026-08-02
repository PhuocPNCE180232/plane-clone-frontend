"use client";

import { useMemo, useRef, useState } from "react";
import { BarChart2, Check, ChevronRight, FolderOpen } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { WorkspaceHomeLink } from "@/components/shared/WorkspaceHomeLink";
import { getIssueAssigneeId, getIssueProjectId } from "./analytics.helpers";

import { OverviewAnalyticsTab } from "./tabs/OverviewAnalyticsTab";
import { ProjectsAnalyticsTab } from "./tabs/ProjectsAnalyticsTab";
import { UsersAnalyticsTab } from "./tabs/UsersAnalyticsTab";
import { WorkItemsAnalyticsTab } from "./tabs/WorkItemsAnalyticsTab";
import { CyclesAnalyticsTab } from "./tabs/CyclesAnalyticsTab";
import { ModulesAnalyticsTab } from "./tabs/ModulesAnalyticsTab";
import { IntakeAnalyticsTab } from "./tabs/IntakeAnalyticsTab";

type AnalyticsTab =
  | "overview"
  | "projects"
  | "users"
  | "work-items"
  | "cycles"
  | "modules"
  | "intake";

type ProjectFilter = "all" | string;

const TABS: { value: AnalyticsTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "projects", label: "Projects" },
  { value: "users", label: "Users" },
  { value: "work-items", label: "Work items" },
  { value: "cycles", label: "Cycles" },
  { value: "modules", label: "Modules" },
  { value: "intake", label: "Intake" },
];

export const WorkspaceAnalyticsPage = () => {
  const { projects, issues, cycles, modules, isLoading, isError } =
    useWorkspaceData();

  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [selectedProjectId, setSelectedProjectId] =
    useState<ProjectFilter>("all");
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );

  const filteredProjects = useMemo(() => {
    if (selectedProjectId === "all") return projects;

    return projects.filter((project) => project.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const filteredProjectIds = useMemo(() => {
    return new Set(filteredProjects.map((project) => project.id));
  }, [filteredProjects]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) =>
      filteredProjectIds.has(getIssueProjectId(issue)),
    );
  }, [filteredProjectIds, issues]);

  const filteredCycles = useMemo(() => {
    return cycles.filter((cycle) => filteredProjectIds.has(cycle.project_id));
  }, [cycles, filteredProjectIds]);

  const filteredModules = useMemo(() => {
    return modules.filter((module) =>
      filteredProjectIds.has(module.project_id),
    );
  }, [filteredProjectIds, modules]);

  const uniqueAssigneeIds = useMemo(() => {
    const assigneeIds = filteredIssues
      .map((issue) => getIssueAssigneeId(issue))
      .filter((assigneeId): assigneeId is string => Boolean(assigneeId));

    return Array.from(new Set(assigneeIds));
  }, [filteredIssues]);

  const memberCount = Math.max(uniqueAssigneeIds.length, 1);

  const projectFilterLabel =
    selectedProjectId === "all"
      ? "All projects"
      : (selectedProject?.name ?? "Selected project");

  const handleSelectProject = (projectId: ProjectFilter) => {
    setSelectedProjectId(projectId);
    setShowProjectMenu(false);
  };
  const projectMenuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(
    projectMenuRef,
    () => setShowProjectMenu(false),
    showProjectMenu,
  );

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <OverviewAnalyticsTab
          projects={filteredProjects}
          issues={filteredIssues}
          cycles={filteredCycles}
          modules={filteredModules}
          memberCount={memberCount}
        />
      );
    }

    if (activeTab === "projects") {
      return (
        <ProjectsAnalyticsTab
          projects={filteredProjects}
          issues={filteredIssues}
          cycles={filteredCycles}
          modules={filteredModules}
        />
      );
    }

    if (activeTab === "users") {
      return (
        <UsersAnalyticsTab
          issues={filteredIssues}
          memberCount={memberCount}
          uniqueAssigneeIds={uniqueAssigneeIds}
        />
      );
    }

    if (activeTab === "work-items") {
      return (
        <WorkItemsAnalyticsTab
          issues={filteredIssues}
          projects={filteredProjects}
        />
      );
    }

    if (activeTab === "cycles") {
      return (
        <CyclesAnalyticsTab
          cycles={filteredCycles}
          projects={filteredProjects}
          issues={filteredIssues}
        />
      );
    }

    if (activeTab === "modules") {
      return (
        <ModulesAnalyticsTab
          modules={filteredModules}
          projects={filteredProjects}
          issues={filteredIssues}
        />
      );
    }

    return <IntakeAnalyticsTab />;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-400">
        Loading analytics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-500">
        Cannot load analytics.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <WorkspaceHomeLink>Workspace</WorkspaceHomeLink>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">Analytics</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          </div>

          <p className="mt-1 text-sm text-gray-400">
            Workspace insights across projects, work items, cycles, and modules.
          </p>
        </div>

        <div ref={projectMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProjectMenu((value) => !value)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            {projectFilterLabel}
            <ChevronRight className="h-3.5 w-3.5 rotate-90" />
          </button>

          {showProjectMenu && (
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => handleSelectProject("all")}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
              >
                All projects
                {selectedProjectId === "all" && (
                  <Check className="h-3.5 w-3.5 text-[#3f76ff]" />
                )}
              </button>

              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleSelectProject(project.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
                >
                  <span className="truncate">{project.name}</span>
                  {selectedProjectId === project.id && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#3f76ff]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${
              activeTab === tab.value
                ? "border-[#3f76ff] text-[#3f76ff]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};
