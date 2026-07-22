import { X, Lock, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateProjectMutation } from "@/hooks/use-projects";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "@/hooks/use-toast";

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");
  const [network, setNetwork] = useState<"public" | "private">("public");

  const { activeWorkspaceId, setProject } = useAppStore();

  const { mutate: handleCreateProject, isPending } = useCreateProjectMutation();

  const onSubmit = () => {
    if (!name.trim() || !identifier.trim() || !activeWorkspaceId) return;

    handleCreateProject(
      {
        name,
        identifier,
        description,
        workspaceId: activeWorkspaceId,
        network,
      },
      {
        onSuccess: (newProject) => {
          setProject(newProject.id);
          // Reset form
          setName("");
          setIdentifier("");
          setDescription("");
          setNetwork("public");
          toast.success("Project created successfully.");
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create project:", error);
          toast.error("Failed to create project. Please try again.");
        },
      }
    );
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Create project</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <div className="mb-5 flex gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Project name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!identifier) {
                    setIdentifier(e.target.value.substring(0, 3).toUpperCase());
                  }
                }}
                placeholder="e.g. Frontend Revamp"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
              />
            </div>
            <div className="w-24">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Identifier
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                placeholder="FRN"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff] uppercase"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
            />
          </div>

          <div>
            <label className="mb-2.5 block text-sm font-medium text-gray-700">
              Network
            </label>
            <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-xl shrink-0">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isPending || !name.trim() || !identifier.trim() || !activeWorkspaceId}
            className="flex items-center justify-center min-w-[130px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
