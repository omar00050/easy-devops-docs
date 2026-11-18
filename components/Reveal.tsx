"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds `is-armed` on mount and `is-visible` once the element scrolls into
 * view. The motion itself lives in globals.css (`.diagram-reveal`) so it can
 * be switched off wholesale under `prefers-reduced-motion`. Without
 * JavaScript nothing is armed, so the diagram stays fully visible.
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setArmed(true);

    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`diagram-reveal ${armed ? "is-armed" : ""} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
