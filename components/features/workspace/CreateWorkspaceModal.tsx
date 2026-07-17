import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "@/lib/services/workspace.service";
import { useAppStore } from "@/hooks/use-app-store";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

type CreateWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();
  const setWorkspace = useAppStore((state) => state.setWorkspace);
  const { user } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: handleCreateWorkspace, isPending } = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (newWorkspace) => {
      // Invalidate the workspaces query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // Set the newly created workspace as active
      setWorkspace(newWorkspace.id);
      // Close modal and reset state
      setName("");
      setUrl("");
      setErrorMsg("");
      onClose();
      // Navigate to new workspace
      router.push(`/${newWorkspace.slug}/projects`);
    },
    onError: (error: any) => {
      console.error("Failed to create workspace:", error);
      setErrorMsg(error?.message || "Failed to create workspace. Please try another URL.");
    },
  });

  if (!isOpen) return null;

  const onSubmit = () => {
    if (!name.trim() || !url.trim() || !user?.id) return;
    setErrorMsg("");
    
    handleCreateWorkspace({
      name,
      slug: url,
      ownerId: user.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Create workspace</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Workspace name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Workspace URL
            </label>
            <div className="flex w-full overflow-hidden rounded-md border border-gray-300 focus-within:border-[#3f76ff] focus-within:ring-1 focus-within:ring-[#3f76ff]">
              <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500 border-r border-gray-300">
                plane.so/
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="acme-corp"
                className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
          {errorMsg && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isPending || !name.trim() || !url.trim()}
            className="flex items-center justify-center min-w-[140px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create workspace"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
