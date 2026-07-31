"use client";

import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { IssueForm } from "./IssueForm";

import {
  List,
  LayoutGrid,
  CalendarDays,
  BarChart2,
  SlidersHorizontal,
  ListFilter,
  Plus,
} from "lucide-react";

export type IssueView = "list" | "board" | "calendar" | "analytics" | "views";

type ToolbarBtnProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

const ToolbarBtn = ({
  icon,
  label,
  active = false,
}: ToolbarBtnProps) => (
  <div
    className={`
      flex items-center gap-1.5
      rounded-md px-2.5 py-1.5
      text-xs font-medium
      transition-colors
      cursor-pointer
      ${
        active
          ? "bg-[#3f76ff]/10 text-[#3f76ff]"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }
    `}
  >
    {icon}
    {label}
  </div>
);

const Divider = () => (
  <span className="mx-1 h-4 w-px shrink-0 bg-gray-200" />
);

interface IssueToolbarProps {
  onCreated: () => void;
  view: IssueView;
  setView: Dispatch<SetStateAction<IssueView>>;
}

export const IssueToolbar = ({
  onCreated,
  view,
  setView,
}: IssueToolbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => setView("list")}>
            <ToolbarBtn
              icon={<List className="h-3.5 w-3.5" />}
              label="List"
              active={view === "list"}
            />
          </button>

          <button type="button" onClick={() => setView("board")}>
            <ToolbarBtn
              icon={<LayoutGrid className="h-3.5 w-3.5" />}
              label="Board"
              active={view === "board"}
            />
          </button>

          <button type="button" onClick={() => setView("calendar")}>
            <ToolbarBtn
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Calendar"
              active={view === "calendar"}
            />
          </button>

          <Divider />

          <button type="button" onClick={() => setView("analytics")}>
            <ToolbarBtn
              icon={<BarChart2 className="h-3.5 w-3.5" />}
              label="Analytics"
              active={view === "analytics"}
            />
          </button>

          <button type="button" onClick={() => setView("views")}>
            <ToolbarBtn
              icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              label="Display"
              active={view === "views"}
            />
          </button>
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
          onClose={() => setOpen(false)}
          onCreated={onCreated}
        />
      )}
    </>
  );
};