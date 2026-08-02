"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRenamePageMutation } from "@/hooks/use-pages";
import { toast } from "@/hooks/use-toast";
import type { Page } from "@/types";

type RenamePageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** The page being renamed — provides the current name and id. */
  page: Page;
  /** Project that owns this page — required for the mutation variables. */
  projectId: string;
};

export const RenamePageModal = ({
  isOpen,
  onClose,
  page,
  projectId,
}: RenamePageModalProps) => {
  // The keyed modal instance is initialized with the current page name on open.
  const [name, setName] = useState(page.name);

  const { mutate: handleRename, isPending } = useRenamePageMutation();

  // ── Submit ──────────────────────────────────────────────────────────────
  // Uses mutate (not mutateAsync) with inline onSuccess/onError callbacks —
  // same pattern as MemberRow.onRemove and CycleCard delete handler.

  const onSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === page.name || !projectId) return;

    handleRename(
      { projectId, id: page.id, data: { name: trimmed } },
      {
        onSuccess: () => {
          toast.success("Page renamed successfully.");
          onClose();
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to rename page. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  const handleClose = () => {
    setName(page.name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col">

        {/* Header — identical structure to CreatePageModal / InviteMemberModal */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Rename Page</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Enter a new name for this page.
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
            autoFocus
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
          />
        </div>

        {/* Footer — identical layout/styles to CreatePageModal footer */}
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
            disabled={isPending || !name.trim() || name.trim() === page.name}
            className="flex items-center justify-center min-w-[110px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
