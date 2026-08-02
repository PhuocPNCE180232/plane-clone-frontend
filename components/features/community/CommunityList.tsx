"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { useCommunity } from "@/hooks/use-community";
import { CommunityPostCard } from "./CommunityPostCard";

export const CommunityList = () => {
  const { data: posts, isLoading } = useCommunity();

  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!posts || posts.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="mb-1 text-sm font-semibold text-gray-700">
            No posts yet
          </h2>
          <p className="max-w-xs text-xs leading-relaxed text-gray-400">
            Be the first to start a discussion.
          </p>
        </div>
      </div>
    );
  }

  // Newest first — sort by created_at timestamp descending
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      {sortedPosts.map((post) => (
        <CommunityPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
