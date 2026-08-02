import { Layers } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center">
      <Layers className="mb-2 h-8 w-8 text-gray-300" />
      <p className="text-sm font-medium text-gray-500">No work items found</p>
      <p className="mt-1 text-xs text-gray-400">
        Work items will appear here when project data is available.
      </p>
    </div>
  );
};