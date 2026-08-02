"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ListFilter, Plus } from "lucide-react";
import { CycleForm } from "./CycleForm";

type CycleFilterStatus = "all" | "active" | "upcoming" | "completed";

type CycleHeaderProps = {
  projectId: string;
  filterStatus: CycleFilterStatus;
  setFilterStatus: Dispatch<SetStateAction<CycleFilterStatus>>;
};

export const CycleHeader = ({
  projectId,
  filterStatus,
  setFilterStatus,
}: CycleHeaderProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterLabelMap: Record<CycleFilterStatus, string> = {
    all: "All",
    active: "Active",
    upcoming: "Upcoming",
    completed: "Completed",
  };

  const currentFilterLabel = filterLabelMap[filterStatus];
  const filterOptions: Array<{ value: CycleFilterStatus; label: string }> = [
    { value: "all", label: "All cycles" },
    { value: "active", label: "Active" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      {/* Left: title + description */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Cycles</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Time-boxed sprints to group and ship issues together.
        </p>
      </div>

      {/* Right: toolbar */}
      <div className="flex items-center gap-2">
        {/* Filters */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
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
            <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
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

        {/* Add Cycle */}
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
          Add Cycle
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create cycle</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add a new cycle to organise your work.
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

            <CycleForm projectId={projectId} onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
