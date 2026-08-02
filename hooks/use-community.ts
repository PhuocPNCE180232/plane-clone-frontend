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
  list:  (workspaceId?: string | null) =>
    [...communityKeys.lists(), workspaceId ?? "none"] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/** Returns community posts for the selected workspace. */
export const useCommunity = (workspaceId?: string) =>
  useQuery({
    queryKey: communityKeys.list(workspaceId),
    queryFn: async () => {
      const posts = await getPosts(workspaceId as string);
      return posts.filter((post) => post.workspace_id === workspaceId);
    },
    enabled: !!workspaceId,
  });

/**
 * Mutation for creating a community post.
 * Invalidates the community list on success.
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommunityPost, Error, CreatePostDto>({
    mutationFn: createPost,

    onSuccess: (_post, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.list(variables.workspace_id),
      });
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

  return useMutation<
    CommunityPost,
    Error,
    { postId: string; workspaceId: string }
  >({
    mutationFn: ({ postId, workspaceId }) => toggleLike(postId, workspaceId),

    onSuccess: (_post, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.list(variables.workspaceId),
      });
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
    { postId: string; workspaceId: string; data: AddCommentDto }
  >({
    mutationFn: ({ postId, workspaceId, data }) =>
      addComment(postId, workspaceId, data),

    onSuccess: (_post, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.list(variables.workspaceId),
      });
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

  return useMutation<
    void,
    Error,
    { postId: string; commentId: string; workspaceId: string }
  >({
    mutationFn: ({ postId, commentId, workspaceId }) =>
      deleteComment(postId, commentId, workspaceId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.list(variables.workspaceId),
      });
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

  return useMutation<void, Error, { postId: string; workspaceId: string }>({
    mutationFn: ({ postId, workspaceId }) => deletePost(postId, workspaceId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.list(variables.workspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });
};

