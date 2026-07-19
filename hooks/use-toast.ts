/**
 * hooks/use-toast.ts
 *
 * Zustand store and imperative API for the global Toast notification system.
 *
 * USAGE (from anywhere — mutations, event handlers, services):
 *
 *   import { toast } from "@/hooks/use-toast";
 *
 *   toast.success("Project created successfully");
 *   toast.error("Failed to delete cycle");
 *   toast.warning("No changes were made");
 *   toast.info("Syncing with server...");
 *
 * Each call returns the toast id so it can be dismissed early if needed:
 *
 *   const id = toast.success("Uploading...", { duration: 10_000 });
 *   toast.dismiss(id);
 */

import { create } from "zustand";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  /** Auto-dismiss delay in ms. Defaults vary by variant (see `toast` object). */
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
}

// ─── Zustand store ─────────────────────────────────────────────────────────

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// ─── Imperative API ────────────────────────────────────────────────────────
// Calls getState() so this works outside React components (e.g. in mutation
// onError callbacks, service functions, or plain event handlers).

function addToast(
  variant: ToastVariant,
  message: string,
  duration: number
): string {
  return useToastStore.getState().addToast({ variant, message, duration });
}

export const toast = {
  /** Green — use for successful operations. */
  success: (message: string, options?: { duration?: number }) =>
    addToast("success", message, options?.duration ?? 4000),

  /** Red — use for errors and failures. Stays visible longer by default. */
  error: (message: string, options?: { duration?: number }) =>
    addToast("error", message, options?.duration ?? 6000),

  /** Amber — use for non-critical warnings or potential issues. */
  warning: (message: string, options?: { duration?: number }) =>
    addToast("warning", message, options?.duration ?? 5000),

  /** Blue — use for neutral informational messages. */
  info: (message: string, options?: { duration?: number }) =>
    addToast("info", message, options?.duration ?? 4000),

  /** Dismiss a toast early by its id. */
  dismiss: (id: string) => useToastStore.getState().removeToast(id),
} as const;
