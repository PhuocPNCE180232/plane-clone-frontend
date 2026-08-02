import {
  CalendarDays,
  Clock3,
  LayoutGrid,
  List,
  ListFilter,
  Search,
  Share2,
  SlidersHorizontal,
} from "lucide-react";

import { ToolbarButton } from "./ToolbarButton";
import { ViewModeButton } from "./ViewModeButton";

import type { ViewMode } from "./types";

interface ViewToolbarProps {
  viewMode: ViewMode;
  searchQuery: string;
  showDisplayPanel: boolean;
  showFilterPanel: boolean;
  hasActiveFilters: boolean;
  shareStatus: string;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (value: string) => void;
  onToggleDisplay: () => void;
  onToggleFilters: () => void;
  onShare: () => void;
}

export const ViewToolbar = ({
  viewMode,
  searchQuery,
  showDisplayPanel,
  showFilterPanel,
  hasActiveFilters,
  shareStatus,
  setViewMode,
  setSearchQuery,
  onToggleDisplay,
  onToggleFilters,
  onShare,
}: ViewToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <ViewModeButton
          active={viewMode === "list"}
          icon={<List className="h-3.5 w-3.5" />}
          label="List"
          onClick={() => setViewMode("list")}
        />

        <ViewModeButton
          active={viewMode === "calendar"}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          label="Calendar"
          onClick={() => setViewMode("calendar")}
        />

        <ViewModeButton
          active={viewMode === "board"}
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
          label="Board"
          onClick={() => setViewMode("board")}
        />

        <ViewModeButton
          active={viewMode === "timeline"}
          icon={<Clock3 className="h-3.5 w-3.5" />}
          label="Timeline"
          onClick={() => setViewMode("timeline")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-8 items-center gap-2 rounded-md border border-gray-200 px-2">
          <Search className="h-3.5 w-3.5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search"
            className="h-full w-36 border-none bg-transparent text-xs outline-none placeholder:text-gray-400"
          />
        </div>

        <ToolbarButton
          active={showDisplayPanel}
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label="Display"
          onClick={onToggleDisplay}
        />

        <ToolbarButton
          active={showFilterPanel || hasActiveFilters}
          icon={<ListFilter className="h-3.5 w-3.5" />}
          label="Filters"
          onClick={onToggleFilters}
        />

        <ToolbarButton
          icon={<Share2 className="h-3.5 w-3.5" />}
          label={shareStatus || "Share"}
          onClick={onShare}
        />
      </div>
    </div>
  );
};