"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

import { useClickOutside } from "@/hooks/use-click-outside";
import { useWorkspaceData } from "@/hooks/use-workspace-data";

import { AddViewModal } from "./AddViewModal";
import { DisplayPanel } from "./DisplayPanel";
import { FilterPanel } from "./FilterPanel";
import { SavedViewsSidebar } from "./SavedViewsSidebar";
import { ViewToolbar } from "./ViewToolbar";

import { BoardViewMode } from "./modes/BoardViewMode";
import { CalendarViewMode } from "./modes/CalendarViewMode";
import { ListViewMode } from "./modes/ListViewMode";
import { TimelineViewMode } from "./modes/TimelineViewMode";

import type {
  AddViewDraft,
  DisplayOptions,
  IssuePriorityFilter,
  IssueStateFilter,
  SavedView,
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

const INITIAL_ADD_VIEW_DRAFT: AddViewDraft = {
  name: "",
  description: "",
  mode: "list",
  access: "private",
  searchQuery: "",
  stateFilter: "all",
  priorityFilter: "all",
  displayOptions: DEFAULT_DISPLAY_OPTIONS,
};

export const WorkspaceViewsPage = () => {
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
  const [showAddViewModal, setShowAddViewModal] = useState(false);

  const [shareStatus, setShareStatus] = useState("");
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [addViewDraft, setAddViewDraft] =
    useState<AddViewDraft>(INITIAL_ADD_VIEW_DRAFT);

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

  const openAddViewModal = () => {
    setAddViewDraft({
      name: "",
      description: "",
      mode: viewMode,
      access: "private",
      searchQuery,
      stateFilter,
      priorityFilter,
      displayOptions,
    });

    setShowAddViewModal(true);
  };

  const closeAddViewModal = () => {
    setAddViewDraft(INITIAL_ADD_VIEW_DRAFT);
    setShowAddViewModal(false);
  };

  const resetToAllWorkItems = () => {
    setViewMode("list");
    setSearchQuery("");
    setStateFilter("all");
    setPriorityFilter("all");
    setDisplayOptions(DEFAULT_DISPLAY_OPTIONS);
    setShowDisplayPanel(false);
    setShowFilterPanel(false);
  };

  const handleCreateSavedView = () => {
    const trimmedName = addViewDraft.name.trim();

    if (!trimmedName) return;

    setSavedViews((currentViews) => [
      {
        id: `view-${Date.now()}`,
        name: trimmedName,
        description: addViewDraft.description.trim(),
        mode: addViewDraft.mode,
        access: addViewDraft.access,
        searchQuery: addViewDraft.searchQuery,
        stateFilter: addViewDraft.stateFilter,
        priorityFilter: addViewDraft.priorityFilter,
        displayOptions: addViewDraft.displayOptions,
        createdAt: new Date().toISOString(),
      },
      ...currentViews,
    ]);

    closeAddViewModal();
  };

  const handleApplySavedView = (savedView: SavedView) => {
    setViewMode(savedView.mode);
    setSearchQuery(savedView.searchQuery);
    setStateFilter(savedView.stateFilter);
    setPriorityFilter(savedView.priorityFilter);
    setDisplayOptions(savedView.displayOptions);
    setShowDisplayPanel(false);
    setShowFilterPanel(false);
  };

  const handleDeleteSavedView = (viewId: string) => {
    setSavedViews((currentViews) =>
      currentViews.filter((savedView) => savedView.id !== viewId),
    );
  };

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
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <span>Workspace</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">Views</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <SavedViewsSidebar
          savedViews={savedViews}
          onAddView={openAddViewModal}
          onApplyView={handleApplySavedView}
          onDeleteView={handleDeleteSavedView}
          onResetToAllWorkItems={resetToAllWorkItems}
        />

        <section className="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  All work items
                </h1>
                <p className="mt-1 text-xs text-gray-400">
                  Workspace level view of work items across active projects.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddViewModal}
                className="flex items-center gap-1.5 rounded-md bg-[#3f76ff] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2d63e8]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add view
              </button>
            </div>

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
              />
            )}

            {viewMode === "board" && (
              <BoardViewMode
                issues={filteredIssues}
                projectMap={projectMap}
                displayOptions={displayOptions}
              />
            )}

            {viewMode === "calendar" && (
              <CalendarViewMode
                issuesByDate={issuesByDate}
                projectMap={projectMap}
                displayOptions={displayOptions}
              />
            )}

            {viewMode === "timeline" && (
              <TimelineViewMode
                issues={filteredIssues}
                projectMap={projectMap}
                displayOptions={displayOptions}
              />
            )}
          </div>
        </section>
      </div>

      {showAddViewModal && (
        <AddViewModal
          draft={addViewDraft}
          setDraft={setAddViewDraft}
          onClose={closeAddViewModal}
          onCreate={handleCreateSavedView}
        />
      )}
    </div>
  );
};