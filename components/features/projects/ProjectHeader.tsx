import { Plus } from "lucide-react";

export const ProjectHeader = () => {
  return (
    <div className="mb-6 flex items-start justify-between">
      {/* Left: title + description */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Manage and track all your team&apos;s projects.
        </p>
      </div>

      {/* Right: action button */}
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
        New Project
      </button>
    </div>
  );
};