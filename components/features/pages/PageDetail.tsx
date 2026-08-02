"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Loader2, CircleDashed } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import { usePage, useUpdatePageMutation } from "@/hooks/use-pages";
import { toast } from "@/hooks/use-toast";

export const PageDetail = () => {
  const params       = useParams();
  const router       = useRouter();
  const slug         = (params?.workspaceSlug as string) ?? "";
  const projectId    = (params?.projectId     as string) ?? "";
  const pageId       = (params?.pageId        as string) ?? "";

  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId    = useAppStore((state) => state.activeWorkspaceId);
  const activeWorkspace      = workspaces?.find((w) => w.id === activeWorkspaceId);

  const { data: page, isLoading } = usePage(projectId || null, pageId || null);

  // ── Content editing state ──────────────────────────────────────────────────
  // All hooks must be called before early returns (React rules of hooks).
  // Initialized empty; synced via useEffect once page data arrives or
  // after a successful save invalidates the detail cache.
  const [content, setContent] = useState("");

  const { mutate: saveContent, isPending: isSaving } = useUpdatePageMutation();

  // Sync local textarea value whenever the fetched page content changes.
  // This covers both the initial load and cache refreshes after a save.
  useEffect(() => {
    if (page) setContent(page.content);
  }, [page?.content]);

  // True only when local content differs from the last-fetched value.
  const hasChanges = page ? content !== page.content : false;

  // ── Loading — same Loader2 pattern as ProjectOverview ─────────────────────
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f76ff]" />
      </div>
    );
  }

  // ── Not found — same structure as ProjectOverview "Project not found" ──────
  if (!page) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <CircleDashed className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Page not found</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          This page does not exist or may have been deleted.
        </p>
        <button
          onClick={() => router.push(`/${slug}/projects/${projectId}/pages`)}
          className="mt-6 rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors"
        >
          Back to Pages
        </button>
      </div>
    );
  }

  // ── Save handler ───────────────────────────────────────────────────────────
  // Uses mutate with inline callbacks — same pattern as PageRow.onDelete /
  // RenamePageModal. Toast feedback stays in the component, not the hook.
  const onSave = () => {
    if (!hasChanges || !projectId || !pageId) return;

    saveContent(
      { projectId, id: pageId, data: { content } },
      {
        onSuccess: () => {
          toast.success("Page saved.");
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to save page. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  let updatedLabel = "recently";
  try {
    const d = new Date(page.updated_at);
    if (!isNaN(d.getTime())) {
      updatedLabel = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    updatedLabel = "recently";
  }

  return (
    <>
      {/* Breadcrumb — unchanged from Phase 4 */}
      <div className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${slug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <Link
          href={`/${slug}/projects`}
          className="transition-colors hover:text-gray-900"
        >
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <Link
          href={`/${slug}/projects/${projectId}/pages`}
          className="transition-colors hover:text-gray-900"
        >
          Pages
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="max-w-[200px] truncate font-medium text-gray-900">
          {page.name}
        </span>
      </div>

      {/* Page shell */}
      <div className="mx-auto max-w-3xl">

        {/* Page header — title + meta + Save button on the same row */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <FileText className="h-6 w-6 shrink-0 text-gray-400" />
            <h1 className="flex-1 text-2xl font-semibold text-gray-900 leading-tight">
              {page.name}
            </h1>
          </div>

          {/* Meta row: last updated + Save button ─────────────────────────── */}
          <div className="ml-9 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Last edited {updatedLabel}
            </p>

            {/* Save button — disabled when nothing changed or request in flight.
                Same size/color as CTA buttons throughout the project. */}
            <button
              onClick={onSave}
              disabled={!hasChanges || isSaving}
              className="
                flex items-center gap-1.5
                rounded-md bg-[#3f76ff]
                px-3 py-1.5
                text-xs font-medium text-white
                hover:bg-[#2d63e8]
                transition-colors
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="mb-8 border-gray-100" />

        {/* Content textarea — plain text, no rich editor.
            Borderless + transparent background gives a document-editing feel.
            placeholder replaces the Phase 4 static empty-state paragraph. */}
        <div className="min-h-[300px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your page..."
            rows={16}
            className="
              w-full resize-none
              bg-transparent
              text-sm leading-relaxed text-gray-700
              placeholder:text-gray-300
              outline-none focus:outline-none
              border-0
            "
          />
        </div>
      </div>
    </>
  );
};
