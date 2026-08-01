import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  type CreatePostDto,
  type AddCommentDto,
} from "@/lib/services/community.service";
import type { CommunityPost } from "@/types";

// ─── Keys ──────────────────────────────────────────────────────────────────

export const communityKeys = {
  all:   ["community"] as const,
  lists: () => [...communityKeys.all, "list"] as const,
  list:  () => [...communityKeys.lists()] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/** Returns all community posts. */
export const useCommunity = () =>
  useQuery({
    queryKey: communityKeys.list(),
    queryFn:  getPosts,
  });

/**
 * Mutation for creating a community post.
 * Invalidates the community list on success.
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommunityPost, Error, CreatePostDto>({
    mutationFn: createPost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });
};

/**
 * Mutation for toggling like on a community post.
 * Invalidates the community list on success.
 */
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommunityPost, Error, { postId: string }>({
    mutationFn: ({ postId }) => toggleLike(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to toggle like:", error);
    },
  });
};

/**
 * Mutation for adding a comment to a community post.
 * Invalidates the community list on success.
 */
export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CommunityPost,
    Error,
    { postId: string; data: AddCommentDto }
  >({
    mutationFn: ({ postId, data }) => addComment(postId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to add comment:", error);
    },
  });
};

/**
 * Mutation for deleting a comment from a community post.
 * Invalidates the community list on success.
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { postId: string; commentId: string }>({
    mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to delete comment:", error);
    },
  });
};

/**
 * Mutation for deleting a community post.
 * Invalidates the community list on success.
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });
};

