"use client";

import { X, Loader2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspace } from "@/lib/services/workspace.service";
import { toast } from "@/hooks/use-toast";
import type { Workspace } from "@/types";

type EditWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
};

const EMOJI_LIST = [
  "🚀", "⭐", "🔥", "💡", "🎯", "🏆", "💎", "🌟",
  "🎨", "🛠️", "📊", "🔬", "🌈", "🎭", "🏗️", "⚡",
  "🌙", "☀️", "🌊", "🎪", "🦁", "🐉", "🦋", "🌺",
  "🍀", "🎵", "🎮", "📱", "💻", "🔑", "🎁", "🏠",
];

export const EditWorkspaceModal = ({ isOpen, onClose, workspace }: EditWorkspaceModalProps) => {
  const [name, setName] = useState(workspace.name);
  const [logo, setLogo] = useState(workspace.logo || "🚀");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Sync state when workspace prop changes
  useEffect(() => {
    if (isOpen) {
      setName(workspace.name);
      setLogo(workspace.logo || "🚀");
    }
  }, [isOpen, workspace]);

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

  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: (data: { name: string; logo: string }) =>
      updateWorkspace(workspace.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace updated successfully.");
      onClose();
    },
    onError: (error: any) => {
      console.error("Failed to update workspace:", error);
      toast.error(error?.message || "Failed to update workspace.");
    },
  });

  if (!isOpen) return null;

  const hasChanges = name.trim() !== workspace.name || logo !== (workspace.logo || "🚀");

  const onSubmit = () => {
    if (!name.trim()) return;
    handleUpdate({ name: name.trim(), logo });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Edit workspace</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* Logo + Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Workspace name
            </label>
            <div className="flex items-center gap-2">
              {/* Emoji picker trigger */}
              <div className="relative flex-shrink-0" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex h-9 w-14 items-center justify-center gap-1 rounded-md border border-gray-300 bg-gray-50 text-xl hover:bg-gray-100 transition-colors"
                  title="Choose logo"
                >
                  <span>{logo}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    <p className="mb-2 text-xs font-medium text-gray-500 px-1">Choose an emoji</p>
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
                            logo === emoji ? "bg-blue-50 ring-1 ring-blue-300" : ""
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
                placeholder="e.g. Acme Corp"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
                autoFocus
              />
            </div>
          </div>

          {/* Read-only URL info */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Workspace URL
              <span className="ml-1.5 text-xs font-normal text-gray-400">(read-only — change in Settings)</span>
            </label>
            <div className="flex w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50">
              <span className="flex items-center px-3 text-sm text-gray-500 border-r border-gray-200">
                plane.so/
              </span>
              <span className="flex-1 px-3 py-2 text-sm text-gray-500 select-all">
                {workspace.slug}
              </span>
            </div>
          </div>
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
            disabled={isPending || !name.trim() || !hasChanges}
            className="flex items-center justify-center min-w-[120px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
