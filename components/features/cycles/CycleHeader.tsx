"use client";

import { useState } from "react";
import { ListFilter, Plus } from "lucide-react";
import { CycleForm } from "./CycleForm";

export const CycleHeader = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

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

            <CycleForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
