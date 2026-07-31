"use client";

import { useState } from "react";
import { SlidersHorizontal, Trash2 } from "lucide-react";
import {
  useCreateProjectViewMutation,
  useDeleteProjectViewMutation,
  useProjectViews,
} from "@/hooks/use-views";

interface IssueSavedViewsProps {
  projectId: string;
}

export const IssueSavedViews = ({ projectId }: IssueSavedViewsProps) => {
  const [name, setName] = useState("");

  const viewsQuery = useProjectViews(projectId);
  const createViewMutation = useCreateProjectViewMutation(projectId); 
  const deleteViewMutation = useDeleteProjectViewMutation();

  const handleCreateView = () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    createViewMutation.mutate({
      name: trimmedName,
      filters: {},
    });

    setName("");
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Saved views
            </h3>
            <p className="text-xs text-gray-400">
              Save reusable issue views for this project.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="View name"
            className="h-8 rounded-md border border-gray-300 px-3 text-xs outline-none focus:border-[#3f76ff]"
          />

          <button
            type="button"
            onClick={handleCreateView}
            disabled={!name.trim()}
            className="h-8 rounded-md bg-[#3f76ff] px-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save view
          </button>
        </div>
      </div>

      {viewsQuery.isLoading && (
        <p className="text-xs text-gray-400">Loading views...</p>
      )}

      {viewsQuery.isError && (
        <p className="text-xs text-red-500">Cannot load saved views.</p>
      )}

      {viewsQuery.data?.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center">
          <p className="text-xs text-gray-400">No saved views yet.</p>
        </div>
      )}

      <div className="space-y-2">
        {viewsQuery.data?.map((view) => (
          <div
            key={view.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{view.name}</p>
              <p className="text-xs text-gray-400">
                Created {new Date(view.created_at).toLocaleDateString()}
              </p>
            </div>

            <button
              type="button"
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              onClick={() =>
                deleteViewMutation.mutate({
                  projectId,
                  viewId: view.id,
                })
              }
              aria-label="Delete saved view"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};