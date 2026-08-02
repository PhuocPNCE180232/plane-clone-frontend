"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseClickOutsideOptions {
  enabled?: boolean;
  closeOnEscape?: boolean;
}

export const useClickOutside = <Element extends HTMLElement>(
  ref: RefObject<Element | null>,
  onClose: () => void,
  optionsOrEnabled: UseClickOutsideOptions | boolean = true,
) => {
  const onCloseRef = useRef(onClose);

  const enabled =
    typeof optionsOrEnabled === "boolean"
      ? optionsOrEnabled
      : optionsOrEnabled.enabled ?? true;

  const closeOnEscape =
    typeof optionsOrEnabled === "boolean"
      ? true
      : optionsOrEnabled.closeOnEscape ?? true;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const element = ref.current;

      if (!element || element.contains(event.target as Node)) return;

      onCloseRef.current();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEscape || event.key !== "Escape") return;

      onCloseRef.current();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEscape, enabled, ref]);
};