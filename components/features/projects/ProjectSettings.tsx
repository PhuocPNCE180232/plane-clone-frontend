"use client";

import { useParams, useRouter } from "next/navigation";
import { Lock, Globe, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject, deleteProject } from "@/lib/services/project.service";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "@/hooks/use-toast";
import { confirm } from "@/hooks/use-confirm";

export const ProjectSettings = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = (params?.workspaceSlug as string) ?? "";
  const projectId = (params?.projectId as string) ?? "";
  
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const { activeWorkspaceId } = useAppStore();
  
  const project = projects?.find((p) => p.id === projectId);

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");
  const [network, setNetwork] = useState<"public" | "private">("public");

  // Populate state when project data is loaded
  useEffect(() => {
    if (project) {
      setName(project.name);
      setIdentifier(project.identifier);
      setDescription(project.description || "");
      setNetwork(project.network || "public");
    }
  }, [project]);

  const { mutate: handleUpdateProject, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWorkspaceId] });
      toast.success("Project updated successfully.");
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project settings.");
    }
  });

  const { mutate: handleDeleteProject, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWorkspaceId] });
      toast.success("Project deleted successfully.");
      router.push(`/${slug}/projects`);
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project.");
    }
  });

  const onUpdate = () => {
    if (!name.trim() || !identifier.trim()) return;
    handleUpdateProject({ name, identifier, description, network });
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete Project",
      description: "The project will be permanently deleted, including all its issues, cycles, and settings. This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (ok) {
      handleDeleteProject();
    }
  };

  if (isProjectsLoading) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f76ff]" />
      </div>
    );
  }

  if (!project && !isProjectsLoading) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-6 text-center text-gray-500">
        Project not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Project Settings</h1>

      {/* General Settings Section */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">General</h2>
        
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="flex-1 max-w-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
                />
              </div>
              
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Identifier
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff] uppercase"
                />
              </div>
            </div>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button 
              onClick={onUpdate}
              disabled={isUpdating || !name.trim() || !identifier.trim()}
              className="flex items-center rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update settings
            </button>
          </div>
        </div>
      </section>

      {/* Network Settings */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Network</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div 
              onClick={() => setNetwork("public")}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                network === "public" 
                  ? "border-[#3f76ff] bg-[#3f76ff]/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`mt-0.5 rounded-md p-1.5 ${network === "public" ? "bg-[#3f76ff]/10 text-[#3f76ff]" : "bg-gray-100 text-gray-500"}`}>
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h4 className={`text-sm font-medium ${network === "public" ? "text-gray-900" : "text-gray-700"}`}>Public</h4>
                <p className="mt-0.5 text-xs text-gray-500">Anyone in the workspace can view and join this project.</p>
              </div>
            </div>

            <div 
              onClick={() => setNetwork("private")}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                network === "private" 
                  ? "border-[#3f76ff] bg-[#3f76ff]/5" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`mt-0.5 rounded-md p-1.5 ${network === "private" ? "bg-[#3f76ff]/10 text-[#3f76ff]" : "bg-gray-100 text-gray-500"}`}>
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h4 className={`text-sm font-medium ${network === "private" ? "text-gray-900" : "text-gray-700"}`}>Private</h4>
                <p className="mt-0.5 text-xs text-gray-500">Only workspace members invited to the project can access it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section>
        <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
        
        <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden flex flex-col divide-y divide-red-100">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Archive Project</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                Archiving the project will hide it from active views but retain all data.
              </p>
            </div>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Archive project
            </button>
          </div>

          <div className="p-6 flex items-center justify-between bg-red-50/30">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Delete Project</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                The project will be permanently deleted, including all its issues, cycles, and settings. This action cannot be undone.
              </p>
            </div>
            <button 
              onClick={onDelete}
              disabled={isDeleting}
              className="rounded-md flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
