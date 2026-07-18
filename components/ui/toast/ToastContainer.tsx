"use client";

/**
 * components/ui/toast/ToastContainer.tsx
 *
 * Renders all active toasts into a fixed portal at the bottom-right of the
 * screen. Mounted once in app/providers.tsx — never render this elsewhere.
 *
 * Uses ReactDOM.createPortal so the container is always a direct child of
 * <body>, regardless of where in the component tree providers.tsx lives.
 * This prevents z-index and stacking-context bugs from ancestor elements.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToastStore } from "@/hooks/use-toast";
import { Toast } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  // ── SSR guard ────────────────────────────────────────────────────────────
  // createPortal requires a DOM node. We defer mounting until after hydration
  // so this component is safe in Next.js server/client rendering.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>,
    document.body
  );
}
