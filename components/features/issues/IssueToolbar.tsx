"use client";

import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  BarChart2,
  CalendarDays,
  LayoutGrid,
  List,
  ListFilter,
  Plus,
} from "lucide-react";

import { IssueForm } from "./IssueForm";
import type { IssueView } from "./types";

type ToolbarBtnProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
};

const ToolbarBtn = ({
  icon,
  label,
  active = false,
  onClick,
}: ToolbarBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
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

const Divider = () => (
  <span className="mx-1 h-4 w-px shrink-0 bg-gray-200" />
);

interface IssueToolbarProps {
  projectId: string;
  onCreated: () => void;
  view: IssueView;
  setView: Dispatch<SetStateAction<IssueView>>;
  showProjectViews?: boolean;
}

export const IssueToolbar = ({
  projectId,
  onCreated,
  view,
  setView,
  showProjectViews = false,
}: IssueToolbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex flex-wrap items-center gap-0.5">
          <ToolbarBtn
            icon={<List className="h-3.5 w-3.5" />}
            label="List"
            active={view === "list"}
            onClick={() => setView("list")}
          />

          <ToolbarBtn
            icon={<LayoutGrid className="h-3.5 w-3.5" />}
            label="Board"
            active={view === "board"}
            onClick={() => setView("board")}
          />

          {showProjectViews && (
            <>
              <ToolbarBtn
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label="Calendar"
                active={view === "calendar"}
                onClick={() => setView("calendar")}
              />

              <Divider />

              <ToolbarBtn
                icon={<BarChart2 className="h-3.5 w-3.5" />}
                label="Analytics"
                active={view === "analytics"}
                onClick={() => setView("analytics")}
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="
              flex items-center gap-1.5
              rounded-md border border-gray-300 bg-white
              px-3 py-1.5
              text-xs font-medium text-gray-600
              hover:bg-gray-50
            "
          >
            <ListFilter className="h-3.5 w-3.5" />
            Filters
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              flex items-center gap-1.5
              rounded-md bg-[#3f76ff]
              px-3 py-1.5
              text-xs font-medium text-white
              hover:bg-[#2d63e8]
            "
          >
            <Plus className="h-3.5 w-3.5" />
            Add Work Item
          </button>
        </div>
      </div>

      {open && (
        <IssueForm
          projectId={projectId}
          onClose={() => setOpen(false)}
          onCreated={onCreated}
        />
      )}
    </>
  );
};
