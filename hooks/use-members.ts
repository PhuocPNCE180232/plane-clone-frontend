import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMembers,
  inviteMember,
  removeMember,
  type InviteMemberDto,
} from "@/lib/services/member.service";
import type { Member } from "@/types";
import { useAppStore } from "./use-app-store";

// ─── Keys ──────────────────────────────────────────────────────────────────

export const memberKeys = {
  all:    ["members"] as const,
  lists:  () => [...memberKeys.all, "list"] as const,
  list:   (workspaceId?: string | null) =>
    [...memberKeys.lists(), workspaceId ?? "all"] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Returns all members that belong to the active workspace.
 * Filtering by workspace_id is done client-side after fetching, matching
 * the same pattern used by useProjects().
 */
export const useMembers = () => {
  const { activeWorkspaceId } = useAppStore();

  return useQuery({
    queryKey: memberKeys.list(activeWorkspaceId),
    queryFn: async () => {
      const all = await getMembers();
      return all.filter((m) => m.workspace_id === activeWorkspaceId);
    },
    enabled: !!activeWorkspaceId,
  });
};

/**
 * Mutation for inviting a new workspace member.
 * Invalidates the members list on settle so the table refreshes automatically.
 * Toast feedback is handled by the calling component (CreateProjectModal pattern).
 */
export const useInviteMemberMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAppStore();

  return useMutation<Member, Error, InviteMemberDto>({
    mutationFn: inviteMember,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.list(activeWorkspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to invite member:", error);
    },
  });
};

/**
 * Mutation for removing a member from the workspace.
 * Invalidates the members list on success so the table refreshes automatically.
 * Toast feedback is handled by the calling component (CycleCard pattern).
 */
export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAppStore();

  return useMutation<void, Error, string>({
    mutationFn: removeMember,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.list(activeWorkspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to remove member:", error);
    },
  });
};
