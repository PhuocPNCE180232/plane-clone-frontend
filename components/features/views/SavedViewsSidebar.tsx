import { Layers, Lock, Plus, Trash2, Users } from "lucide-react";

import type { SavedView } from "./types";

interface SavedViewsSidebarProps {
  savedViews: SavedView[];
  onAddView: () => void;
  onApplyView: (savedView: SavedView) => void;
  onDeleteView: (viewId: string) => void;
  onResetToAllWorkItems: () => void;
}

export const SavedViewsSidebar = ({
  savedViews,
  onAddView,
  onApplyView,
  onDeleteView,
  onResetToAllWorkItems,
}: SavedViewsSidebarProps) => {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Views</h2>

        <button
          type="button"
          onClick={onAddView}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Add view"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onResetToAllWorkItems}
        className="flex w-full items-center gap-2 rounded-lg bg-[#3f76ff]/10 px-3 py-2 text-left text-sm font-medium text-[#3f76ff]"
      >
        <Layers className="h-4 w-4" />
        All work items
      </button>

      <div className="mt-4 rounded-lg border border-dashed border-gray-200 p-3">
        <p className="text-xs font-medium text-gray-500">Saved views</p>

        {savedViews.length === 0 ? (
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Create focused views for backlog, high priority, board planning, or timeline tracking.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {savedViews.map((savedView) => (
              <div
                key={savedView.id}
                className="group rounded-lg border border-gray-100 bg-white p-2 hover:border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onApplyView(savedView)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-xs font-semibold text-gray-800">
                      {savedView.name}
                    </p>

                    {savedView.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-gray-400">
                        {savedView.description}
                      </p>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteView(savedView.id)}
                    className="rounded p-1 text-gray-300 opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    aria-label="Delete saved view"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  <ViewBadge label={savedView.mode} />

                  <ViewBadge
                    label={savedView.access}
                    icon={
                      savedView.access === "private" ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Users className="h-3 w-3" />
                      )
                    }
                  />

                  {savedView.stateFilter !== "all" && (
                    <ViewBadge label={savedView.stateFilter} />
                  )}

                  {savedView.priorityFilter !== "all" && (
                    <ViewBadge label={savedView.priorityFilter} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

interface ViewBadgeProps {
  label: string;
  icon?: React.ReactNode;
}

const ViewBadge = ({ label, icon }: ViewBadgeProps) => {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium capitalize text-gray-500">
      {icon}
      {label}
    </span>
  );
};