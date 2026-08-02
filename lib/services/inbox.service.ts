/**
 * lib/services/inbox.service.ts
 *
 * Plain async functions for the Inbox / Notifications domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoints:
 *   GET    /inbox              → Notification[]
 *   PATCH  /inbox/read-all    → { success: boolean }
 *   PATCH  /inbox/:id/read    → Notification
 *   DELETE /inbox/:id         → void
 */

import { get, patch, del } from "@/lib/api/request";
import type { Notification } from "@/types";

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns notifications for one workspace. */
export const getNotifications = (workspaceId: string): Promise<Notification[]> =>
  get<Notification[]>(`/inbox?workspace_id=${encodeURIComponent(workspaceId)}`);

/** Marks a single notification as read and returns the updated resource. */
export const markAsRead = (id: string, workspaceId: string): Promise<Notification> =>
  patch<Notification>(
    `/inbox/${id}/read?workspace_id=${encodeURIComponent(workspaceId)}`,
  );

/** Marks all notifications as read. */
export const markAllAsRead = (workspaceId: string): Promise<{ success: boolean }> =>
  patch<{ success: boolean }>(
    `/inbox/read-all?workspace_id=${encodeURIComponent(workspaceId)}`,
    {},
  );

/** Deletes a notification by ID. Returns void (204 No Content). */
export const deleteNotification = (id: string, workspaceId: string): Promise<void> =>
  del<void>(`/inbox/${id}?workspace_id=${encodeURIComponent(workspaceId)}`);
