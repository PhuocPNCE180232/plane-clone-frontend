/**
 * hooks/use-confirm.ts
 *
 * Zustand store and Promise-based imperative API for the global Confirm Modal.
 *
 * USAGE (from any async function, event handler, or React component):
 *
 *   import { confirm } from "@/hooks/use-confirm";
 *
 *   const confirmed = await confirm({
 *     title: "Delete cycle",
 *     description: "This action cannot be undone.",
 *     confirmText: "Delete",   // defaults to "Confirm"
 *     cancelText: "Cancel",    // defaults to "Cancel"
 *     variant: "danger",       // "danger" = red confirm button, "default" = blue
 *   });
 *
 *   if (confirmed) {
 *     // user clicked Confirm
 *   }
 *
 * The ConfirmModal component calls resolveConfirm(true/false) when the user
 * clicks a button or presses Escape. The Promise resolves at that point.
 */

import { create } from "zustand";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ConfirmConfig {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  /** "danger" renders the confirm button in red. "default" renders it in blue. */
  variant?: "danger" | "default";
}

interface ConfirmState {
  isOpen: boolean;
  config: ConfirmConfig | null;
  /** Internal — opens the modal. Use confirm() instead. */
  _open: (config: ConfirmConfig) => void;
  /** Internal — closes the modal. Use resolveConfirm() instead. */
  _close: () => void;
}

// ─── Zustand store ─────────────────────────────────────────────────────────

export const useConfirmStore = create<ConfirmState>()((set) => ({
  isOpen: false,
  config: null,
  _open: (config) => set({ isOpen: true, config }),
  _close: () => set({ isOpen: false, config: null }),
}));

// ─── Promise resolution ────────────────────────────────────────────────────
// Holds the resolve function of the currently active Promise.
// Module-level (not Zustand state) because functions are not serialisable
// and the Promise lifecycle is synchronous from the component's perspective.

let _resolve: ((value: boolean) => void) | null = null;

// ─── Imperative API ────────────────────────────────────────────────────────

/**
 * Opens the global ConfirmModal and returns a Promise that resolves to:
 * - true  if the user clicks the confirm button
 * - false if the user clicks cancel, the backdrop, or presses Escape
 *
 * Only one confirm dialog can be open at a time.
 * Calling confirm() while another is open will replace it.
 */
export function confirm(config: ConfirmConfig): Promise<boolean> {
  return new Promise((resolve) => {
    // If a previous dialog is still pending, cancel it.
    if (_resolve) {
      _resolve(false);
    }
    _resolve = resolve;
    useConfirmStore.getState()._open(config);
  });
}

/**
 * Called by the ConfirmModal component to resolve the pending Promise.
 * Do NOT call this directly from feature code — use confirm() instead.
 */
export function resolveConfirm(value: boolean): void {
  useConfirmStore.getState()._close();
  if (_resolve) {
    _resolve(value);
    _resolve = null;
  }
}
