"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { useClickOutside } from "@/hooks/use-click-outside";
import { useWorkspaceData } from "@/hooks/use-workspace-data";

import { DisplayPanel } from "./DisplayPanel";
import { FilterPanel } from "./FilterPanel";
import { ViewToolbar } from "./ViewToolbar";

import { BoardViewMode } from "./modes/BoardViewMode";
import { CalendarViewMode } from "./modes/CalendarViewMode";
import { ListViewMode } from "./modes/ListViewMode";
import { TimelineViewMode } from "./modes/TimelineViewMode";

import type {
  DisplayOptions,
  IssuePriorityFilter,
  IssueStateFilter,
  ViewMode,
  WorkspaceProjectMap,
} from "./types";

import {
  getIssueProjectId,
  groupIssuesByDate,
} from "./views.helpers";

const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
  showProject: true,
  showPriority: true,
  showCreatedDate: true,
};

export const WorkspaceViewsPage = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { projects, issues, isLoading, isError } = useWorkspaceData();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] =
    useState<IssueStateFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<IssuePriorityFilter>("all");

  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>(
    DEFAULT_DISPLAY_OPTIONS,
  );

  const [showDisplayPanel, setShowDisplayPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [shareStatus, setShareStatus] = useState("");

  const viewControlsRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(
    viewControlsRef,
    () => {
      setShowDisplayPanel(false);
      setShowFilterPanel(false);
    },
    showDisplayPanel || showFilterPanel,
  );

  const projectMap = useMemo<WorkspaceProjectMap>(() => {
    return new Map(
      projects.map((project) => [
        project.id,
        {
          name: project.name,
          identifier: project.identifier,
        },
      ]),
    );
  }, [projects]);

  const filteredIssues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return issues.filter((issue) => {
      const project = projectMap.get(getIssueProjectId(issue));

      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.state.toLowerCase().includes(query) ||
        issue.priority.toLowerCase().includes(query) ||
        (project?.name.toLowerCase().includes(query) ?? false);

      const matchesState =
        stateFilter === "all" || issue.state === stateFilter;

      const matchesPriority =
        priorityFilter === "all" || issue.priority === priorityFilter;

      return matchesSearch && matchesState && matchesPriority;
    });
  }, [issues, priorityFilter, projectMap, searchQuery, stateFilter]);

  const issuesByDate = useMemo(() => {
    return groupIssuesByDate(filteredIssues);
  }, [filteredIssues]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    stateFilter !== "all" ||
    priorityFilter !== "all";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Copy failed");
    }

    window.setTimeout(() => {
      setShareStatus("");
    }, 1800);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-400">
        Loading workspace views...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-500">
        Cannot load workspace views.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div ref={viewControlsRef}>
            <ViewToolbar
              viewMode={viewMode}
              searchQuery={searchQuery}
              showDisplayPanel={showDisplayPanel}
              showFilterPanel={showFilterPanel}
              hasActiveFilters={hasActiveFilters}
              shareStatus={shareStatus}
              setViewMode={setViewMode}
              setSearchQuery={setSearchQuery}
              onToggleDisplay={() => {
                setShowDisplayPanel((value) => !value);
                setShowFilterPanel(false);
              }}
              onToggleFilters={() => {
                setShowFilterPanel((value) => !value);
                setShowDisplayPanel(false);
              }}
              onShare={handleShare}
            />

            {(showDisplayPanel || showFilterPanel) && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {showDisplayPanel && (
                  <DisplayPanel
                    displayOptions={displayOptions}
                    setDisplayOptions={setDisplayOptions}
                  />
                )}

                {showFilterPanel && (
                  <FilterPanel
                    stateFilter={stateFilter}
                    priorityFilter={priorityFilter}
                    setStateFilter={setStateFilter}
                    setPriorityFilter={setPriorityFilter}
                    onClear={() => {
                      setSearchQuery("");
                      setStateFilter("all");
                      setPriorityFilter("all");
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {viewMode === "list" && (
            <ListViewMode
              issues={filteredIssues}
              projectMap={projectMap}
              displayOptions={displayOptions}
              workspaceSlug={workspaceSlug}
            />
          )}

          {viewMode === "board" && (
            <BoardViewMode
              issues={filteredIssues}
              projectMap={projectMap}
              displayOptions={displayOptions}
              workspaceSlug={workspaceSlug}
            />
          )}

          {viewMode === "calendar" && (
            <CalendarViewMode
              issuesByDate={issuesByDate}
              projectMap={projectMap}
              displayOptions={displayOptions}
              workspaceSlug={workspaceSlug}
            />
          )}

          {viewMode === "timeline" && (
            <TimelineViewMode
              issues={filteredIssues}
              projectMap={projectMap}
              displayOptions={displayOptions}
              workspaceSlug={workspaceSlug}
            />
          )}
        </div>
      </section>
    </div>
  );
};
