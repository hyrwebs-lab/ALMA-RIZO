"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "hidden" | "visible";

/**
 * Fades & slides children into view on scroll.
 * - SSR / first client render: "idle" → no hiding class (content visible,
 *   no hydration mismatch, works without JS).
 * - After mount: elements already in view stay visible; elements below the
 *   fold are hidden (off-screen, no visible flash) then revealed via
 *   IntersectionObserver as they enter the viewport.
 * Respects prefers-reduced-motion (handled in globals.css).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const rect = el.getBoundingClientRect();
    // Already visible on load → don't animate (avoids hiding above-the-fold content).
    if (rect.top < window.innerHeight * 0.9) return;

    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setState("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealClass =
    state === "hidden" ? "reveal" : state === "visible" ? "reveal is-visible" : "";

  return (
    <Tag
      ref={ref}
      className={cn(revealClass, className)}
      style={delay && state !== "idle" ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
