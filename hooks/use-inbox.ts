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
  list:  () => [...inboxKeys.lists()] as const,
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Returns all notifications for the current workspace.
 * No enabled guard needed — inbox is always accessible from the sidebar.
 */
export const useInbox = () =>
  useQuery({
    queryKey: inboxKeys.list(),
    queryFn:  getNotifications,
  });

/**
 * Mutation for marking a single notification as read.
 * Invalidates the inbox list so InboxList refreshes automatically.
 * Toast feedback is handled by the calling component.
 */
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, string>({
    mutationFn: markAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.list() });
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

  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: () => markAllAsRead(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.list() });
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

  return useMutation<void, Error, string>({
    mutationFn: deleteNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.list() });
    },

    onError: (error) => {
      console.error("Failed to delete notification:", error);
    },
  });
};
