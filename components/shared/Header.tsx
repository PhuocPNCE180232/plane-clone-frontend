"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useProjects } from "@/hooks/use-projects";
import { useAppStore } from "@/hooks/use-app-store";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Folder } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const params = useParams();
  const router = useRouter();
  const currentSlug = (params?.workspaceSlug as string) ?? "";
  
  const { data: workspaces } = useWorkspaces();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  
  const { activeProjectId, setProject } = useAppStore();
  
  const currentWorkspace = workspaces?.find((w) => w.slug === currentSlug) || workspaces?.[0];
  const currentProject = projects?.find((p) => p.id === activeProjectId) || projects?.[0];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-[#151b2f] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        {/* Workspace Name (Static part of breadcrumb) */}
        {currentWorkspace && (
          <>
            <Link 
              href={`/${currentWorkspace.slug}`}
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              {currentWorkspace.name}
            </Link>
            <span className="text-gray-500 text-sm">/</span>
          </>
        )}

        {/* Project Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-white text-sm font-semibold hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
            disabled={isProjectsLoading || !projects || projects.length === 0}
          >
            {isProjectsLoading ? (
              <span className="text-gray-400">Loading projects...</span>
            ) : projects && projects.length === 0 ? (
              <span className="text-gray-400">No projects found</span>
            ) : (
              <>
                {currentProject?.name || "Select Project"}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </>
            )}
          </button>

          {isDropdownOpen && projects && projects.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-md border border-gray-200 bg-white py-1.5 shadow-lg z-50">
              <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projects
              </div>
              
              <div className="my-1 border-t border-gray-100" />

              <div className="max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setProject(project.id);
                      setIsDropdownOpen(false);
                      // Navigate to project page if needed, or just stay
                    }}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {project.id === activeProjectId && (
                      <Check className="h-4 w-4 text-[#3f76ff] flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-72 rounded-md px-4 py-2 text-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
        />

        <UserDropdown />
      </div>
    </header>
  );
};