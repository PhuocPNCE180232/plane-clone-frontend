import {
  List,
  LayoutGrid,
  CalendarDays,
  BarChart2,
  SlidersHorizontal,
  ListFilter,
  Plus,
} from "lucide-react";

// ─── Small reusable toolbar button ───────────────────────────────────────────

type ToolbarBtnProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

const ToolbarBtn = ({ icon, label, active = false }: ToolbarBtnProps) => (
  <button
    className={`
      flex items-center gap-1.5
      rounded-md px-2.5 py-1.5
      text-xs font-medium
      transition-colors
      ${
        active
          ? "bg-[#3f76ff]/10 text-[#3f76ff]"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

// ─── Divider ─────────────────────────────────────────────────────────────────

const Divider = () => (
  <span className="mx-1 h-4 w-px shrink-0 bg-gray-200" aria-hidden="true" />
);

// ─── IssueToolbar ────────────────────────────────────────────────────────────

export const IssueToolbar = () => {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">

      {/* Left group: view switcher */}
      <div className="flex items-center gap-0.5">
        <ToolbarBtn
          icon={<List className="h-3.5 w-3.5" />}
          label="List"
          active={true}
        />
        <ToolbarBtn
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
          label="Board"
        />
        <ToolbarBtn
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          label="Calendar"
        />

        <Divider />

        <ToolbarBtn
          icon={<BarChart2 className="h-3.5 w-3.5" />}
          label="Analytics"
        />
        <ToolbarBtn
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label="Display"
        />
      </div>

      {/* Right group: filter + add */}
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
          Add Work Item
        </button>
      </div>
    </div>
  );
};
