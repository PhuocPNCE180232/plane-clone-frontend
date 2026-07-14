"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspace, deleteWorkspace } from "@/lib/services/workspace.service";
import { useAppStore } from "@/hooks/use-app-store";

export const WorkspaceSettings = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = (params?.workspaceSlug as string) ?? "";
  
  const { data: workspaces, isLoading } = useWorkspaces();
  const { activeWorkspaceId } = useAppStore();
  
  const workspace = workspaces?.find((w) => w.slug === slug || w.id === activeWorkspaceId);

  const [name, setName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setWorkspaceSlug(workspace.slug);
    }
  }, [workspace]);

  const { mutate: handleUpdateWorkspace, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateWorkspace(workspace!.id, data),
    onSuccess: (updatedWs) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      alert("Workspace settings updated successfully!");
      // If slug changed, we need to redirect to the new URL
      if (updatedWs.slug !== slug) {
        router.push(`/${updatedWs.slug}/settings`);
      }
    },
    onError: (error) => {
      console.error("Failed to update workspace:", error);
      alert("Failed to update workspace settings.");
    }
  });

  const { mutate: handleDeleteWorkspace, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteWorkspace(workspace!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      const remainingWorkspaces = workspaces?.filter(w => w.id !== workspace!.id) || [];
      if (remainingWorkspaces.length > 0) {
        router.push(`/${remainingWorkspaces[0].slug}`);
      } else {
        router.push("/onboarding");
      }
    },
    onError: (error) => {
      console.error("Failed to delete workspace:", error);
      alert("Failed to delete workspace.");
    }
  });

  const onUpdate = () => {
    if (!name.trim() || !workspaceSlug.trim() || !workspace) return;
    handleUpdateWorkspace({ name, slug: workspaceSlug });
  };

  const onDelete = () => {
    if (!workspace) return;
    if (confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
      handleDeleteWorkspace();
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f76ff]" />
      </div>
    );
  }

  if (!workspace && !isLoading) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-6 text-center text-gray-500">
        Workspace not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Workspace Settings</h1>

      {/* General Settings Section */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">General</h2>
        
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="mb-5 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
              />
            </div>
            
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Workspace URL
              </label>
              <div className="flex w-full overflow-hidden rounded-md border border-gray-300 focus-within:border-[#3f76ff] focus-within:ring-1 focus-within:ring-[#3f76ff]">
                <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500 border-r border-gray-300">
                  plane.so/
                </span>
                <input
                  type="text"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="flex-1 px-3 py-2 text-sm text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button 
              onClick={onUpdate}
              disabled={isUpdating || !name.trim() || !workspaceSlug.trim()}
              className="flex items-center rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update settings
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section>
        <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
        
        <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Delete Workspace</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                The workspace will be permanently deleted, including its projects, issues, and settings. This action is irreversible.
              </p>
            </div>
            <button 
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Delete workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
