"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreatePageMutation } from "@/hooks/use-pages";
import { toast } from "@/hooks/use-toast";

type CreatePageModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreatePageModal = ({ isOpen, onClose }: CreatePageModalProps) => {
  const [name, setName] = useState("");

  // Read project context from URL params — same approach as ProjectOverview /
  // PagesPage. Keeps the props surface minimal (isOpen + onClose only), which
  // matches InviteMemberModal reading activeWorkspaceId from useAppStore()
  // instead of requiring it as a prop.
  const params         = useParams();
  const projectId      = (params?.projectId     as string) ?? "";
  const workspaceSlug  = (params?.workspaceSlug as string) ?? "";

  const router = useRouter();
  const { mutateAsync, isPending } = useCreatePageMutation();

  // ── Submit ──────────────────────────────────────────────────────────────
  // Uses mutateAsync (not mutate) so we can await the new Page object and
  // navigate to its detail URL. Same pattern as InviteMemberModal using
  // mutateAsync to collect results from sequential calls.

  const onSubmit = async () => {
    if (!name.trim() || !projectId) return;

    try {
      const newPage = await mutateAsync({
        projectId,
        data: { name: name.trim() },
      });

      toast.success("Page created successfully.");
      setName("");
      onClose();
      // Navigate to the new page's detail/editor route (Phase 4 will build the UI).
      router.push(`/${workspaceSlug}/projects/${projectId}/pages/${newPage.id}`);
    } catch (e) {
      // Surface server message when available — identical error extraction to
      // InviteMemberModal and MemberRow.
      const message =
        (e as { response?: { data?: { error?: string } } })
          ?.response?.data?.error ??
        "Failed to create page. Please try again.";
      toast.error(message);
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col">

        {/* Header — identical structure to InviteMemberModal header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Create Page</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Add a new page to document this project.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Page name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="e.g. Project Design Spec"
            autoFocus
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
          />
        </div>

        {/* Footer — identical layout/styles to InviteMemberModal footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-xl shrink-0">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isPending || !name.trim()}
            className="flex items-center justify-center min-w-[110px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Page"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
