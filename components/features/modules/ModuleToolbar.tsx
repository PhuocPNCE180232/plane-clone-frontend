"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowUpDown, LayoutGrid, List, ListFilter, Plus } from "lucide-react";
import { ModuleForm } from "./ModuleForm";

type SortKey = "name" | "progress" | "work_items" | "due_date";
type ModuleFilterStatus = "all" | "backlog" | "planned" | "in_progress" | "paused" | "completed" | "cancelled";

type ModuleToolbarProps = {
  view: "board" | "list";
  setView: Dispatch<SetStateAction<"board" | "list">>;
  sortKey: SortKey;
  setSortKey: Dispatch<SetStateAction<SortKey>>;
  sortDirection: "asc" | "desc";
  setSortDirection: Dispatch<SetStateAction<"asc" | "desc">>;
  filterStatus: ModuleFilterStatus;
  setFilterStatus: Dispatch<SetStateAction<ModuleFilterStatus>>;
};

export const ModuleToolbar = ({
  view,
  setView,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
  filterStatus,
  setFilterStatus,
}: ModuleToolbarProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortLabelMap: Record<SortKey, string> = {
    name: "Name",
    progress: "Progress",
    work_items: "Work items",
    due_date: "Due date",
  };

  const filterLabelMap: Record<ModuleFilterStatus, string> = {
    all: "All",
    backlog: "Backlog",
    planned: "Planned",
    in_progress: "In progress",
    paused: "Paused",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const currentSortLabel = sortLabelMap[sortKey];
  const currentFilterLabel = filterLabelMap[filterStatus];
  const filterOptions: Array<{ value: ModuleFilterStatus; label: string }> = [
    { value: "all", label: "All modules" },
    { value: "backlog", label: "Backlog" },
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In progress" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
      {/* Left: view switcher */}
      <div className="flex items-center gap-px">
        <button
          type="button"
          onClick={() => setView("board")}
          className={`
            flex items-center gap-1.5
            rounded-md px-2.5 py-1.5
            text-xs font-medium
            transition-colors
            ${view === "board" ? "bg-[#3f76ff]/10 text-[#3f76ff]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
          `}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Board
        </button>

        <button
          type="button"
          onClick={() => setView("list")}
          className={`
            flex items-center gap-1.5
            rounded-md px-2.5 py-1.5
            text-xs font-medium
            transition-colors
            ${view === "list" ? "bg-[#3f76ff]/10 text-[#3f76ff]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
          `}
        >
          <List className="h-3.5 w-3.5" />
          List
        </button>
      </div>

      {/* Right: sort + filter + add */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSortOpen((current) => !current);
              setIsFilterOpen(false);
            }}
            className="
              flex items-center gap-1.5
              rounded-md border border-gray-300 bg-white
              px-3 py-1.5
              text-xs font-medium text-gray-600
              hover:bg-gray-50 hover:border-gray-400
              transition-colors
            "
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort: {currentSortLabel}
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setSortKey("name");
                  setIsSortOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${sortKey === "name" ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Name
                {sortKey === "name" && <span className="text-xs text-gray-500">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortKey("progress");
                  setIsSortOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${sortKey === "progress" ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Progress
                {sortKey === "progress" && <span className="text-xs text-gray-500">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortKey("work_items");
                  setIsSortOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${sortKey === "work_items" ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Number of work items
                {sortKey === "work_items" && <span className="text-xs text-gray-500">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortKey("due_date");
                  setIsSortOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${sortKey === "due_date" ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Due date
                {sortKey === "due_date" && <span className="text-xs text-gray-500">✓</span>}
              </button>
              <div className="border-t border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Order: {sortDirection === "asc" ? "Ascending" : "Descending"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen((current) => !current);
              setIsSortOpen(false);
            }}
            className={`
              flex items-center gap-1.5
              rounded-md border px-3 py-1.5
              text-xs font-medium transition-colors
              ${filterStatus === "all"
                ? "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                : "border-[#3f76ff]/20 bg-[#3f76ff]/10 text-[#3f76ff]"
              }
            `}
          >
            <ListFilter className="h-3.5 w-3.5" />
            Filter: {currentFilterLabel}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFilterStatus(option.value);
                    setIsFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${filterStatus === option.value ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {option.label}
                  {filterStatus === option.value && <span className="text-xs text-gray-500">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="
            flex items-center gap-1.5
            rounded-md bg-[#3f76ff]
            px-3 py-1.5
            text-xs font-medium text-white
            hover:bg-[#2d63e8]
            transition-colors
          "
        >
          <Plus className="h-3.5 w-3.5" />
          Add Module
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create module</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add a new module to group related work.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <ModuleForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
