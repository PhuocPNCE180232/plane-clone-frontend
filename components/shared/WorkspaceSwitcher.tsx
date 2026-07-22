"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Settings, Plus, Loader2, Pencil } from "lucide-react";
import { CreateWorkspaceModal } from "../features/workspace/CreateWorkspaceModal";
import { EditWorkspaceModal } from "../features/workspace/EditWorkspaceModal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";

// ─── Helper: render workspace logo (emoji or letter fallback) ─────────────────
const WorkspaceLogo = ({
  logo,
  name,
  size = "sm",
}: {
  logo?: string;
  name: string;
  size?: "sm" | "xs";
}) => {
  const sizeClass = size === "sm" ? "h-5 w-5 text-[10px]" : "h-4 w-4 text-[9px]";
  if (logo) {
    return (
      <div
        className={`flex ${sizeClass} flex-shrink-0 items-center justify-center rounded bg-gray-100 text-sm leading-none`}
      >
        {logo}
      </div>
    );
  }
  return (
    <div
      className={`flex ${sizeClass} flex-shrink-0 items-center justify-center rounded bg-[#3f76ff] font-bold text-white uppercase`}
    >
      {name[0]}
    </div>
  );
};

// ─── WorkspaceSwitcher ────────────────────────────────────────────────────────

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const currentSlug = (params?.workspaceSlug as string) ?? "";

  const { data: workspaces, isLoading } = useWorkspaces();
  const setWorkspace = useAppStore((state) => state.setWorkspace);

  const currentWorkspace = workspaces?.find((w) => w.slug === currentSlug) || workspaces?.[0];

  useEffect(() => {
    if (currentWorkspace) {
      setWorkspace(currentWorkspace.id);
    }
  }, [currentWorkspace, setWorkspace]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-4 px-2 py-1.5 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0 || !currentWorkspace) {
    return (
      <div className="mb-4 px-2">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex w-full items-center gap-2 rounded-md p-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4 text-gray-500" />
          Create workspace
        </button>
        <CreateWorkspaceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="relative mb-4 px-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md p-1.5 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <WorkspaceLogo logo={currentWorkspace.logo} name={currentWorkspace.name} size="sm" />
          <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
            {currentWorkspace.name}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-2 top-full z-50 mt-1 w-64 rounded-md border border-gray-200 bg-white py-1.5 shadow-lg">
          {/* Current workspace header with edit button */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-medium text-gray-500 truncate">
              {currentWorkspace.name}
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsEditModalOpen(true);
              }}
              className="ml-2 flex-shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Edit workspace"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link
            href={`/${currentWorkspace.slug}/settings`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 text-gray-500" />
            Workspace settings
          </Link>

          <div className="my-1 border-t border-gray-100" />

          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/${workspace.slug}`}
              onClick={() => {
                setWorkspace(workspace.id);
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 truncate">
                <WorkspaceLogo logo={workspace.logo} name={workspace.name} size="sm" />
                <span className="truncate">{workspace.name}</span>
              </div>
              {workspace.id === currentWorkspace.id && (
                <Check className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
              )}
            </Link>
          ))}

          <div className="my-1 border-t border-gray-100" />

          <button
            onClick={() => {
              setIsOpen(false);
              setIsCreateModalOpen(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-500" />
            Create workspace
          </button>
        </div>
      )}

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Workspace Modal */}
      {currentWorkspace && (
        <EditWorkspaceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          workspace={currentWorkspace}
        />
      )}
    </div>
  );
};
