"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Settings, Plus, Loader2 } from "lucide-react";
import { CreateWorkspaceModal } from "../features/workspace/CreateWorkspaceModal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const currentSlug = (params?.workspaceSlug as string) ?? "";
  
  const { data: workspaces, isLoading } = useWorkspaces();
  const setWorkspace = useAppStore(state => state.setWorkspace);

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
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center gap-2 rounded-md p-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4 text-gray-500" />
          Create workspace
        </button>
        <CreateWorkspaceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#3f76ff] text-[10px] font-bold text-white uppercase">
            {currentWorkspace.name[0]}
          </div>
          <span className="text-sm font-semibold text-gray-900 truncate max-w-[130px]">
            {currentWorkspace.name}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-2 top-full z-50 mt-1 w-64 rounded-md border border-gray-200 bg-white py-1.5 shadow-lg">
          <div className="px-3 py-1.5 text-xs font-medium text-gray-500 truncate">
            {currentWorkspace.name}
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
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[#3f76ff]/10 text-[#3f76ff] text-[10px] font-bold uppercase">
                  {workspace.name[0]}
                </div>
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
              setIsModalOpen(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-500" />
            Create workspace
          </button>
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
