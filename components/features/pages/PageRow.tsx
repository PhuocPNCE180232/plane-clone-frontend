"use client";

import { useState } from "react";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import type { Page } from "@/types";
import { useDeletePageMutation } from "@/hooks/use-pages";
import { confirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";
import { RenamePageModal } from "./RenamePageModal";

// ─── Component ──────────────────────────────────────────────────────────────

interface PageRowProps {
  page: Page;
  projectId: string;
  workspaceSlug: string;
}

export const PageRow = ({ page, projectId, workspaceSlug }: PageRowProps) => {
  const [isMenuOpen,         setIsMenuOpen]         = useState(false);
  const [isRenameModalOpen,  setIsRenameModalOpen]  = useState(false);

  const router   = useRouter();
  const pathname = usePathname();

  // Detect if the user is currently viewing this page's detail route.
  // Used to navigate back to the list after deletion.
  const isCurrentPage = pathname?.endsWith(`/pages/${page.id}`) ?? false;

  const { mutate: handleDelete, isPending: isDeleting } = useDeletePageMutation();

  let editedLabel = "recently";
  try {
    const d = new Date(page.updated_at);
    if (!isNaN(d.getTime())) {
      editedLabel = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    editedLabel = "recently";
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleRowClick = () => {
    if (isMenuOpen) return; // don't navigate if menu is open
    router.push(`/${workspaceSlug}/projects/${projectId}/pages/${page.id}`);
  };

  const onRename = () => {
    setIsMenuOpen(false);
    setIsRenameModalOpen(true);
  };

  // Delete — confirm dialog pattern from MemberRow / CycleCard.
  const onDelete = async () => {
    setIsMenuOpen(false);

    const ok = await confirm({
      title:       "Delete Page",
      description: `"${page.name}" will be permanently deleted. This action cannot be undone.`,
      confirmText: "Delete",
      cancelText:  "Cancel",
      variant:     "danger",
    });

    if (!ok) return;

    handleDelete(
      { projectId, id: page.id },
      {
        onSuccess: () => {
          toast.success("Page deleted successfully.");
          // If the user is viewing the deleted page, navigate back to the list.
          if (isCurrentPage) {
            router.push(`/${workspaceSlug}/projects/${projectId}/pages`);
          }
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to delete page. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        className="
          group
          flex cursor-pointer items-center gap-4
          border-b border-gray-100
          px-4 py-3
          transition-colors
          hover:bg-gray-50
          last:border-b-0 last:rounded-b-xl
        "
      >
        {/* Page icon */}
        <div className="w-5 shrink-0 text-gray-400">
          <FileText className="h-4 w-4" />
        </div>

        {/* Page name */}
        <div className="min-w-0 flex-1">
          <span className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-[#3f76ff]">
            {page.name}
          </span>
        </div>

        {/* Last edited timestamp */}
        <div className="w-36 shrink-0 text-xs text-gray-400">
          {editedLabel}
        </div>

        {/* Three-dot menu — same isMenuOpen dropdown pattern as MemberRow / ProjectCard */}
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="More options"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((v) => !v);
            }}
            className="
              rounded p-1
              text-gray-300
              opacity-0
              transition-all
              group-hover:opacity-100
              hover:bg-gray-100
              hover:text-gray-600
              disabled:cursor-not-allowed
            "
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Dropdown — identical styles to MemberRow / ProjectCard dropdown */}
          {isMenuOpen && (
            <>
              {/* Click-outside backdrop — same pattern as MemberRow */}
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5 text-gray-400" />
                  Rename
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rename modal — rendered outside the row div to avoid z-index issues.
          Same pattern as MemberRow rendering its confirmation inside the component. */}
      <RenamePageModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        page={page}
        projectId={projectId}
      />
    </>
  );
};
