import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/services/inbox.service";
import type { Notification } from "@/types";

// ─── Keys ──────────────────────────────────────────────────────────────────
// Flat hierarchy — inbox is not scoped per-project so no nested keys needed.
// Matches the same shape as memberKeys but without the workspace-id segment
// because the service returns all workspace notifications in one call.

export const inboxKeys = {
  all:   ["inbox"] as const,
  lists: () => [...inboxKeys.all, "list"] as const,
  list:  (workspaceId?: string | null) =>
    [...inboxKeys.lists(), workspaceId ?? "none"] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Returns all notifications for the current workspace.
 * No enabled guard needed — inbox is always accessible from the sidebar.
 */
export const useInbox = (workspaceId?: string) =>
  useQuery({
    queryKey: inboxKeys.list(workspaceId),
    queryFn: async () => {
      const notifications = await getNotifications(workspaceId as string);
      return notifications.filter(
        (notification) => notification.workspace_id === workspaceId,
      );
    },
    enabled: !!workspaceId,
  });

/**
 * Mutation for marking a single notification as read.
 * Invalidates the inbox list so InboxList refreshes automatically.
 * Toast feedback is handled by the calling component.
 */
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Notification,
    Error,
    { notificationId: string; workspaceId: string }
  >({
    mutationFn: ({ notificationId, workspaceId }) =>
      markAsRead(notificationId, workspaceId),

    onSuccess: (_notification, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.list(variables.workspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });
};

/**
 * Mutation for marking all notifications as read.
 * Invalidates the inbox list on success.
 */
export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: markAllAsRead,

    onSuccess: (_result, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.list(workspaceId) });
    },

    onError: (error) => {
      console.error("Failed to mark all as read:", error);
    },
  });
};

/**
 * Mutation for deleting a notification.
 * Invalidates the inbox list on success so InboxList refreshes automatically.
 * Toast feedback is handled by the calling component (CycleCard pattern).
 */
export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { notificationId: string; workspaceId: string }
  >({
    mutationFn: ({ notificationId, workspaceId }) =>
      deleteNotification(notificationId, workspaceId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.list(variables.workspaceId),
      });
    },

    onError: (error) => {
      console.error("Failed to delete notification:", error);
    },
  });
};
