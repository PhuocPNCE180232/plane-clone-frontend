"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateQuestionMutation } from "@/hooks/use-questions";
import { toast } from "@/hooks/use-toast";

type CreateQuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateQuestionModal = ({
  isOpen,
  onClose,
}: CreateQuestionModalProps) => {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createQuestionMutate, isPending } = useCreateQuestionMutation();

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  const onSubmit = () => {
    if (!title.trim()) return;

    createQuestionMutate(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          toast.success("Question published successfully.");
          handleClose();
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to publish question. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col">
        {/* Header — identical structure to CreatePostModal */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Ask Question</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Ask your team for help, guidance, or code clarification.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Inputs */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && title.trim()) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="What is your question?"
              autoFocus
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, code snippets, or error details..."
              rows={4}
              className="w-full resize-none rounded-md border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
            />
          </div>
        </div>

        {/* Footer */}
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
            disabled={isPending || !title.trim()}
            className="flex items-center justify-center min-w-[90px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Asking...
              </>
            ) : (
              "Ask Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
