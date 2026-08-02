"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Heart, MessageCircle, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CommunityPost, CommunityComment } from "@/types";
import {
  useDeletePostMutation,
  useToggleLikeMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "@/hooks/use-community";
import { confirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";

interface CommunityPostCardProps {
  post: CommunityPost;
}

export const CommunityPostCard = ({ post }: CommunityPostCardProps) => {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentText, setCommentText]               = useState("");

  const { mutate: handleDeletePost, isPending: isDeletingPost } = useDeletePostMutation();
  const { mutate: handleToggleLike, isPending: isTogglingLike } = useToggleLikeMutation();
  const { mutate: handleAddComment, isPending: isAddingComment } = useAddCommentMutation();
  const { mutate: handleDeleteComment }                         = useDeleteCommentMutation();

  let postTime = "recently";
  try {
    const d = new Date(post.created_at);
    if (!isNaN(d.getTime())) {
      postTime = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    postTime = "recently";
  }

  const likesCount    = post.likes ?? 0;
  const isLiked       = post.liked ?? false;
  const commentsList  = post.comments ?? [];

  // ── Post Handlers ─────────────────────────────────────────────────────────

  const onDeletePost = async () => {
    const ok = await confirm({
      title:       "Delete Post",
      description: "Are you sure you want to delete this post? This action cannot be undone.",
      confirmText: "Delete",
      cancelText:  "Cancel",
      variant:     "danger",
    });

    if (!ok) return;

    handleDeletePost({ postId: post.id, workspaceId: post.workspace_id }, {
      onSuccess: () => {
        toast.success("Post deleted successfully.");
      },
      onError: (e) => {
        const message =
          (e as { response?: { data?: { error?: string } } })
            ?.response?.data?.error ??
          "Failed to delete post. Please try again.";
        toast.error(message);
      },
    });
  };

  const onToggleLike = () => {
    handleToggleLike(
      { postId: post.id, workspaceId: post.workspace_id },
      {
        onError: () => {
          toast.error("Failed to update like. Please try again.");
        },
      }
    );
  };

  // ── Comment Handlers ──────────────────────────────────────────────────────

  const onSubmitComment = () => {
    if (!commentText.trim()) return;

    handleAddComment(
      {
        postId: post.id,
        workspaceId: post.workspace_id,
        data: { content: commentText.trim() },
      },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Comment added.");
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to add comment. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  const onDeleteComment = async (commentId: string) => {
    const ok = await confirm({
      title:       "Delete Comment",
      description: "Are you sure you want to delete this comment?",
      confirmText: "Delete",
      cancelText:  "Cancel",
      variant:     "danger",
    });

    if (!ok) return;

    handleDeleteComment(
      { postId: post.id, commentId, workspaceId: post.workspace_id },
      {
        onSuccess: () => {
          toast.success("Comment deleted.");
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to delete comment. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-gray-300">
      {/* ── Top row: Avatar + Author + Relative time + Delete Post button ─ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={post.avatar}
            alt={post.author}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover border border-gray-200 shrink-0"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900 leading-tight">
              {post.author}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{postTime}</p>
          </div>
        </div>

        {/* Delete Post action button (hover-revealed) */}
        <button
          type="button"
          title="Delete post"
          onClick={onDeletePost}
          disabled={isDeletingPost}
          className="
            rounded p-1.5
            text-gray-400
            opacity-0 group-hover:opacity-100
            transition-all duration-150
            hover:bg-gray-100 hover:text-red-500
            disabled:cursor-not-allowed disabled:opacity-30
          "
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* ── Post content ──────────────────────────────────────────────────── */}
      <div className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
        {post.content}
      </div>

      {/* ── Footer row: Likes + Comments count ───────────────────────────── */}
      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
        {/* Like Button */}
        <button
          type="button"
          onClick={onToggleLike}
          disabled={isTogglingLike}
          className="
            flex items-center gap-1.5 text-xs font-medium text-gray-500
            hover:text-red-500 transition-colors
            disabled:opacity-50
          "
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
          <span>{likesCount}</span>
        </button>

        {/* Comments Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCommentsExpanded((v) => !v)}
          className="
            flex items-center gap-1.5 text-xs font-medium text-gray-500
            hover:text-[#3f76ff] transition-colors
          "
        >
          <MessageCircle className="h-4 w-4 text-gray-400 hover:text-[#3f76ff]" />
          <span>
            {commentsList.length > 0
              ? `View comments (${commentsList.length})`
              : "Comments"}
          </span>
        </button>
      </div>

      {/* ── Expanded Comments Section ────────────────────────────────────── */}
      {isCommentsExpanded && (
        <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
          {/* Comments List */}
          {commentsList.length === 0 ? (
            <p className="py-2 text-center text-xs text-gray-400">
              No comments yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {commentsList.map((comment: CommunityComment) => (
                <CommentRow
                  key={comment.id}
                  comment={comment}
                  onDelete={() => onDeleteComment(comment.id)}
                />
              ))}
            </div>
          )}

          {/* Add Comment Input */}
          <div className="flex gap-2 pt-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmitComment();
                }
              }}
              placeholder="Write a comment..."
              rows={2}
              className="
                flex-1 resize-none rounded-md border border-gray-200 p-2.5
                text-xs text-gray-900 placeholder-gray-400
                focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]
              "
            />
            <button
              type="button"
              onClick={onSubmitComment}
              disabled={isAddingComment || !commentText.trim()}
              className="
                self-end rounded-md bg-[#3f76ff] px-3 py-2
                text-xs font-medium text-white
                hover:bg-[#2d63e8] transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
                flex items-center gap-1.5
              "
            >
              {isAddingComment ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Comment Row Component ──────────────────────────────────────────────────

interface CommentRowProps {
  comment: CommunityComment;
  onDelete: () => void;
}

const CommentRow = ({ comment, onDelete }: CommentRowProps) => {
  let commentTime = "recently";
  try {
    const d = new Date(comment.created_at);
    if (!isNaN(d.getTime())) {
      commentTime = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    commentTime = "recently";
  }

  return (
    <div className="group/comment flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-2.5 border border-gray-100">
      <div className="flex items-start gap-2.5 min-w-0">
        <Image
          src={comment.avatar}
          alt={comment.author}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full object-cover border border-gray-200 shrink-0 mt-0.5"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-900">
              {comment.author}
            </span>
            <span className="text-[10px] text-gray-400">{commentTime}</span>
          </div>
          <p className="mt-0.5 text-xs text-gray-700 leading-normal whitespace-pre-line">
            {comment.content}
          </p>
        </div>
      </div>

      {/* Delete Comment button (hover revealed — MemberRow style) */}
      <button
        type="button"
        title="Delete comment"
        onClick={onDelete}
        className="
          rounded p-1 text-gray-400
          opacity-0 group-hover/comment:opacity-100
          transition-all duration-150
          hover:bg-gray-200 hover:text-red-500
          shrink-0
        "
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
