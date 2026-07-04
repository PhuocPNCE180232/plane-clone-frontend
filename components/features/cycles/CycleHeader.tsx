"use client";

import { ListFilter, Plus } from "lucide-react";

export const CycleHeader = () => {
  return (
    <div className="mb-6 flex items-start justify-between">
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
        <button
          className="
            flex items-center gap-1.5
            rounded-md border border-gray-300
            bg-white px-3 py-1.5
            text-xs font-medium text-gray-600
            hover:bg-gray-50 hover:border-gray-400
            transition-colors
          "
        >
          <ListFilter className="h-3.5 w-3.5" />
          Filters
        </button>

        {/* Add Cycle */}
        <button
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
    </div>
  );
};
