"use client";

/**
 * components/ui/confirm-modal/ConfirmModal.tsx
 *
 * Global confirm dialog. Mounted once in app/providers.tsx.
 * Do NOT render this component directly in feature code.
 *
 * Use the imperative API instead:
 *
 *   import { confirm } from "@/hooks/use-confirm";
 *
 *   const ok = await confirm({
 *     title: "Delete cycle",
 *     description: "This action cannot be undone.",
 *     confirmText: "Delete",
 *     variant: "danger",
 *   });
 *   if (ok) { ... }
 *
 * Keyboard: pressing Escape resolves the Promise with false (cancel).
 * Clicking the backdrop also resolves with false.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { useConfirmStore, resolveConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";

export function ConfirmModal() {
  const { isOpen, config } = useConfirmStore();

  // ── SSR guard ────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Auto-focus: move focus to Cancel button when the modal opens ──────────
  // Declared here (before the early return) so the ref is stable across
  // renders and the rule-of-hooks order is never violated.
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  // ── Keyboard handling ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") resolveConfirm(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // ── Body scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !config) return null;

  const isDanger = config.variant === "danger";
  const confirmText = config.confirmText ?? "Confirm";
  const cancelText = config.cancelText ?? "Cancel";

  return createPortal(
    // Single overlay — backdrop colour, flex-centering, and click-to-close in one element.
    // Clicking anywhere outside the white card bubbles up to this handler.
    <div
      aria-hidden="true"
      onClick={() => resolveConfirm(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/40"
      style={{ transition: "opacity 150ms ease", opacity: isOpen ? 1 : 0 }}
    >
      {/* Dialog card — stopPropagation prevents clicks inside from reaching the overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={config.description ? "confirm-modal-description" : undefined}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-4">
          {isDanger && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2
              id="confirm-modal-title"
              className="text-base font-semibold text-gray-900"
            >
              {config.title}
            </h2>
            {config.description && (
              <p
                id="confirm-modal-description"
                className="mt-1.5 text-sm leading-relaxed text-gray-500"
              >
                {config.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4 rounded-b-xl">
          {/* Cancel */}
          <Button
            ref={cancelRef}
            variant="ghost"
            onClick={() => resolveConfirm(false)}
            className="text-gray-600 hover:bg-gray-100 hover:text-gray-600"
          >
            {cancelText}
          </Button>

          {/* Confirm */}
          <Button
            variant="default"
            onClick={() => resolveConfirm(true)}
            className={
              isDanger
                ? "bg-red-500 hover:bg-red-600 shadow-none"
                : "bg-[#3f76ff] hover:bg-[#2d63e8] shadow-none"
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
