import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Immediate hover on enter; debounced false on leave to avoid rapid
 * enter/leave flicker (e.g. at card edges) thrashing dependent effects.
 */
export function useDebouncedHover(leaveDelayMs = 120) {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHovered(false);
      timeoutRef.current = null;
    }, leaveDelayMs);
  }, [leaveDelayMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    hovered,
    hoverHandlers: { onMouseEnter, onMouseLeave } as const,
  };
}
