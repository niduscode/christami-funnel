"use client";

/**
 * Cursor glow / cursor spotlight — un radial-gradient cálido fixed que sigue
 * al cursor por toda la página. mix-blend-mode lo deja sentir como "luz" sobre
 * el contenido. No bloquea clicks (pointer-events: none).
 */
import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta accesibilidad: si el usuario pidió menos movimiento, no se muestra.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.display = "none";
      return;
    }

    let rafId = 0;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    const apply = () => {
      rafId = 0;
      el.style.setProperty("--mx", `${lastX}px`);
      el.style.setProperty("--my", `${lastY}px`);
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId === 0) rafId = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    const onEnter = () => {
      el.style.opacity = "";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden />;
}
