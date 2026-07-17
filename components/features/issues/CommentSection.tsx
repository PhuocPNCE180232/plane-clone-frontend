"use client";

import { useEffect, useState } from "react";
import { createComment, getComments } from "@/lib/services/comment.service";
import type { Comment } from "@/types";
import { mockUsers } from "@/mocks/db";

interface CommentSectionProps {
  issueId: string;
}

export const CommentSection = ({ issueId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getComments(issueId);
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    };

    loadComments();
  }, [issueId]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const newComment = await createComment(issueId, content);

      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-semibold text-gray-800">Comments</h2>

      {/* New Comment Form */}
      <div className="mt-4 flex gap-4">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-300" />

        <div className="flex-1">
          <div className="rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full resize-none rounded-t-lg border-0 bg-transparent p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
              placeholder="Leave a comment..."
              rows={3}
            />

            <div className="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 px-3 py-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Comments */}
      <div className="mt-6 space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm italic text-gray-500">
            No comments yet. Be the first to reply!
          </p>
        ) : (
          comments.map((comment) => {
            const user = mockUsers.find(
              (item) => item.id === comment.user_id
            );

            return (
              <div key={comment.id} className="flex gap-4">
                {/* Avatar */}
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-600">
                    {user?.name?.charAt(0) ?? "?"}
                  </div>
                )}

                <div className="flex-1">
                  {/* User + Time */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name ?? "Unknown User"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>

                  {/* Comment Content */}
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};