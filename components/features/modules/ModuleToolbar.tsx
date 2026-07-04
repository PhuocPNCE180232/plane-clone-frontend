import { LayoutGrid, List, ListFilter, Plus } from "lucide-react";

export const ModuleToolbar = () => {
  return (
    <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3">

      {/* Left: view switcher */}
      <div className="flex items-center gap-px">
        {/* Board — active */}
        <button
          className="
            flex items-center gap-1.5
            rounded-md px-2.5 py-1.5
            text-xs font-medium
            bg-[#3f76ff]/10 text-[#3f76ff]
            transition-colors
          "
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Board
        </button>

        {/* List — inactive */}
        <button
          className="
            flex items-center gap-1.5
            rounded-md px-2.5 py-1.5
            text-xs font-medium text-gray-500
            hover:bg-gray-100 hover:text-gray-700
            transition-colors
          "
        >
          <List className="h-3.5 w-3.5" />
          List
        </button>
      </div>

      {/* Right: filter + add — with a hairline separator before them */}
      <div className="flex items-center gap-2">
        <button
          className="
            flex items-center gap-1.5
            rounded-md border border-gray-300 bg-white
            px-3 py-1.5
            text-xs font-medium text-gray-600
            hover:bg-gray-50 hover:border-gray-400
            transition-colors
          "
        >
          <ListFilter className="h-3.5 w-3.5" />
          Filters
        </button>

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
          Add Module
        </button>
      </div>
    </div>
  );
};
