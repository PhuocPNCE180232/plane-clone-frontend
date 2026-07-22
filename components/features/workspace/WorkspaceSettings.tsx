"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspace, deleteWorkspace } from "@/lib/services/workspace.service";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "@/hooks/use-toast";
import { confirm } from "@/hooks/use-confirm";

const EMOJI_LIST = [
  "🚀", "⭐", "🔥", "💡", "🎯", "🏆", "💎", "🌟",
  "🎨", "🛠️", "📊", "🔬", "🌈", "🎭", "🏗️", "⚡",
  "🌙", "☀️", "🌊", "🎪", "🦁", "🐉", "🦋", "🌺",
  "🍀", "🎵", "🎮", "📱", "💻", "🔑", "🎁", "🏠",
];

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
  const [logo, setLogo] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setWorkspaceSlug(workspace.slug);
      setLogo(workspace.logo || "🚀");
    }
  }, [workspace]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { mutate: handleUpdateWorkspace, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateWorkspace(workspace!.id, data),
    onSuccess: (updatedWs) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace updated successfully.");
      // If slug changed, we need to redirect to the new URL
      if (updatedWs.slug !== slug) {
        router.push(`/${updatedWs.slug}/settings`);
      }
    },
    onError: (error) => {
      console.error("Failed to update workspace:", error);
      toast.error("Failed to update workspace settings.");
    }
  });

  const { mutate: handleDeleteWorkspace, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteWorkspace(workspace!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace deleted successfully.");
      const remainingWorkspaces = workspaces?.filter(w => w.id !== workspace!.id) || [];
      if (remainingWorkspaces.length > 0) {
        router.push(`/${remainingWorkspaces[0].slug}`);
      } else {
        router.push("/onboarding");
      }
    },
    onError: (error) => {
      console.error("Failed to delete workspace:", error);
      toast.error("Failed to delete workspace.");
    }
  });

  const onUpdate = () => {
    if (!name.trim() || !workspaceSlug.trim() || !workspace) return;
    handleUpdateWorkspace({ name, slug: workspaceSlug, logo });
  };

  const onDelete = async () => {
    if (!workspace) return;
    const ok = await confirm({
      title: "Delete Workspace",
      description: "The workspace will be permanently deleted, including its projects, issues, and settings. This action is irreversible.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (ok) {
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
          <div className="p-6 border-b border-gray-100 space-y-5">

            {/* Logo + Name row */}
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Workspace Logo & Name
              </label>
              <div className="flex items-center gap-3">
                {/* Emoji picker trigger */}
                <div className="relative flex-shrink-0" ref={emojiPickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex h-9 w-16 items-center justify-center gap-1 rounded-md border border-gray-300 bg-gray-50 text-xl hover:bg-gray-100 transition-colors"
                    title="Change logo"
                  >
                    <span>{logo}</span>
                    <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="mb-2 text-xs font-medium text-gray-500">Choose an emoji logo</p>
                      <div className="grid grid-cols-8 gap-0.5">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setLogo(emoji);
                              setShowEmojiPicker(false);
                            }}
                            className={`flex h-7 w-7 items-center justify-center rounded text-lg hover:bg-gray-100 transition-colors ${
                              logo === emoji ? "bg-blue-50 ring-1 ring-[#3f76ff]" : ""
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Name input */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
                />
              </div>
            </div>

            {/* URL */}
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
