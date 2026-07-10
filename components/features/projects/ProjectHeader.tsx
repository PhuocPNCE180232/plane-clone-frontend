"use client";

import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { CreateProjectModal } from "./CreateProjectModal";

export const ProjectHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState("grid");

  return (
    <div className="mb-6 flex flex-col gap-6">
      {/* Top row: Title and Button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage and track all your team&apos;s projects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
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

      {/* Bottom row: Tabs and Filters */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`border-b-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "border-[#3f76ff] text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`border-b-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "border-[#3f76ff] text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`border-b-2 py-2 text-sm font-medium transition-colors ${
              activeTab === "archived"
                ? "border-[#3f76ff] text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Archived
          </button>
        </div>

        <div className="flex items-center gap-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
            />
          </div>

          <div className="flex items-center rounded-md border border-gray-300 bg-white">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 ${view === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-gray-300" />
            <button
              onClick={() => setView("list")}
              className={`p-1.5 ${view === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};