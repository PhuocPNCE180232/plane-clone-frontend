"use client";

/**
 * components/ui/toast/Toast.tsx
 *
 * A single Toast notification item.
 * Rendered by ToastContainer — do not use directly in feature code.
 *
 * Auto-dismisses after `duration` ms via a useEffect timer.
 * The timer resets if the toast id changes (i.e. a new toast replaces it).
 */

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore, type ToastItem } from "@/hooks/use-toast";

// ─── Variant config ────────────────────────────────────────────────────────

const VARIANTS = {
  success: {
    Icon: CheckCircle2,
    border: "border-l-green-500",
    icon: "text-green-500",
    label: "Success",
  },
  error: {
    Icon: XCircle,
    border: "border-l-red-500",
    icon: "text-red-500",
    label: "Error",
  },
  warning: {
    Icon: AlertTriangle,
    border: "border-l-amber-500",
    icon: "text-amber-500",
    label: "Warning",
  },
  info: {
    Icon: Info,
    border: "border-l-blue-500",
    icon: "text-blue-500",
    label: "Info",
  },
} as const;

// ─── Component ─────────────────────────────────────────────────────────────

interface ToastProps {
  toast: ToastItem;
}

export function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast);
  const variant = VARIANTS[toast.variant];
  const { Icon } = variant;

  // ── Visibility state for fade-out animation ──────────────────────────────
  const [visible, setVisible] = useState(false);

  // Trigger fade-in on mount (next tick so CSS transition fires)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Auto-dismiss timer ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Allow the fade-out transition to complete before removing from DOM
      setTimeout(() => removeToast(toast.id), 200);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  // ── Manual dismiss ───────────────────────────────────────────────────────
  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => removeToast(toast.id), 200);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-label={variant.label}
      style={{
        transition: "opacity 200ms ease, transform 200ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(1rem)",
      }}
      className={[
        "flex items-start gap-3",
        "w-80 rounded-lg",
        "border border-gray-200 border-l-4",
        variant.border,
        "bg-white shadow-lg",
        "px-4 py-3",
      ].join(" ")}
    >
      {/* Variant icon */}
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${variant.icon}`}
        aria-hidden="true"
      />

      {/* Message */}
      <p className="flex-1 text-sm leading-relaxed text-gray-800">
        {toast.message}
      </p>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
