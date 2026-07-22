"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectList } from "./ProjectList";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";

export const ProjectPage = () => {
    const { data: workspaces } = useWorkspaces();
    const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId);

    const activeWorkspace = workspaces?.find(w => w.id === activeWorkspaceId);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    return (
        <>
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
                <span className="cursor-pointer transition-colors hover:text-gray-900">
                    {activeWorkspace?.name || "Workspace"}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-900">Projects</span>
            </div>

            <ProjectHeader 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <ProjectList searchQuery={searchQuery} activeTab={activeTab} />
        </>
    );
};