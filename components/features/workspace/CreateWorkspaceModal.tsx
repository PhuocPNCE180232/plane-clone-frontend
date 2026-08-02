"use client";

import { X, Loader2, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "@/lib/services/workspace.service";
import { useAppStore } from "@/hooks/use-app-store";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type CreateWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EMOJI_LIST = [
  "🚀", "⭐", "🔥", "💡", "🎯", "🏆", "💎", "🌟",
  "🎨", "🛠️", "📊", "🔬", "🌈", "🎭", "🏗️", "⚡",
  "🌙", "☀️", "🌊", "🎪", "🦁", "🐉", "🦋", "🌺",
  "🍀", "🎵", "🎮", "📱", "💻", "🔑", "🎁", "🏠",
];

export const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("🚀");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const setWorkspace = useAppStore((state) => state.setWorkspace);
  const { user } = useAuth();
  const router = useRouter();

  // Auto-generate URL from name
  const handleNameChange = (value: string) => {
    setName(value);
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setUrl(slug);
  };

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

  const { mutate: handleCreateWorkspace, isPending } = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setWorkspace(newWorkspace.id);
      setName("");
      setUrl("");
      setLogo("🚀");
      setErrorMsg("");
      onClose();
      toast.success("Workspace created successfully.");
      router.push(`/${newWorkspace.slug}/projects`);
    },
    onError: (error: unknown) => {
      console.error("Failed to create workspace:", error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to create workspace. Please try another URL.",
      );
    },
  });

  if (!isOpen) return null;

  const onSubmit = () => {
    if (!name.trim() || !url.trim() || !user?.id) return;
    setErrorMsg("");
    handleCreateWorkspace({
      name,
      slug: url,
      logo,
      ownerId: user.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
        <div className="px-6 py-5 space-y-4">
          {/* Logo + Name row */}
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
                autoFocus
              />
            </div>
          </div>

          {/* URL */}
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
                onChange={(e) => setUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="acme-corp"
                className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
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
