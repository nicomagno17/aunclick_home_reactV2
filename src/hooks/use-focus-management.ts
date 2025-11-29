"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface FocusManagementOptions {
  autoFocus?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

interface FocusManagementReturn {
  focusableElements: HTMLElement[];
  currentFocusIndex: number;
  setFocusIndex: (index: number) => void;
  moveFocus: (direction: "next" | "prev" | "first" | "last") => void;
  focusElement: (element: HTMLElement) => void;
  setupFocusTrap: (containerRef: React.RefObject<HTMLElement>) => void;
  announceToScreenReader: (message: string, priority?: "polite" | "assertive") => void;
}

export function useFocusManagement(
  options: FocusManagementOptions = {}
): FocusManagementReturn {
  const { autoFocus = false, trapFocus = false, restoreFocus = true } = options;
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Screen reader announcement function
  const announceToScreenReader = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (!announcementRef.current) {
        announcementRef.current = document.createElement("div");
        announcementRef.current.setAttribute("aria-live", priority);
        announcementRef.current.setAttribute("aria-atomic", "true");
        announcementRef.current.style.position = "absolute";
        announcementRef.current.style.left = "-10000px";
        announcementRef.current.style.width = "1px";
        announcementRef.current.style.height = "1px";
        announcementRef.current.style.overflow = "hidden";
        document.body.appendChild(announcementRef.current);
      }

      announcementRef.current.setAttribute("aria-live", priority);
      announcementRef.current.textContent = message;
    },
    []
  );

  // Update focusable elements
  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    setFocusableElements(elements);
  }, []);

  // Move focus in a direction
  const moveFocus = useCallback(
    (direction: "next" | "prev" | "first" | "last") => {
      if (focusableElements.length === 0) return;

      let newIndex = currentFocusIndex;

      switch (direction) {
        case "next":
          newIndex = (currentFocusIndex + 1) % focusableElements.length;
          break;
        case "prev":
          newIndex = currentFocusIndex <= 0 ? focusableElements.length - 1 : currentFocusIndex - 1;
          break;
        case "first":
          newIndex = 0;
          break;
        case "last":
          newIndex = focusableElements.length - 1;
          break;
      }

      setCurrentFocusIndex(newIndex);
      focusableElements[newIndex]?.focus();
    },
    [focusableElements, currentFocusIndex]
  );

  // Focus a specific element
  const focusElement = useCallback((element: HTMLElement) => {
    const index = focusableElements.indexOf(element);
    if (index !== -1) {
      setCurrentFocusIndex(index);
    }
    element.focus();
  }, [focusableElements]);

  // Set focus by index
  const setFocusIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < focusableElements.length) {
        setCurrentFocusIndex(index);
        focusableElements[index]?.focus();
      }
    },
    [focusableElements]
  );

  // Focus trap implementation
  const setupFocusTrap = useCallback(
    (containerRef: React.RefObject<HTMLElement>) => {
      if (!containerRef.current || !trapFocus) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          const focusableElements = Array.from(
            containerRef.current!.querySelectorAll(
              'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ) as HTMLElement[];

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement?.focus();
            }
          }
        }

        // Escape key handling
        if (event.key === "Escape") {
          if (restoreFocus && previousFocusRef.current) {
            previousFocusRef.current.focus();
          }
        }
      };

      containerRef.current.addEventListener("keydown", handleKeyDown);

      return () => {
        containerRef.current?.removeEventListener("keydown", handleKeyDown);
      };
    },
    [trapFocus, restoreFocus]
  );

  // Initialize focus management
  useEffect(() => {
    if (autoFocus && containerRef.current) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      updateFocusableElements();

      // Auto-focus first element or specified element
      if (options.initialFocusRef?.current) {
        focusElement(options.initialFocusRef.current);
      } else if (focusableElements.length > 0) {
        focusElement(focusableElements[0]);
      }
    }

    // Update focusable elements when DOM changes
    const observer = new MutationObserver(updateFocusableElements);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled", "tabindex", "aria-hidden"]
      });
    }

    return () => {
      observer.disconnect();
      // Cleanup announcement element
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
        announcementRef.current = null;
      }
    };
  }, [autoFocus, updateFocusableElements, focusElement, options.initialFocusRef]);

  // Update focusable elements on mount and when container changes
  useEffect(() => {
    updateFocusableElements();
  }, [updateFocusableElements]);

  return {
    focusableElements,
    currentFocusIndex,
    setFocusIndex,
    moveFocus,
    focusElement,
    setupFocusTrap,
    announceToScreenReader,
  };
}

export default useFocusManagement;