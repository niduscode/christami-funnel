"use client";

/**
 * Spotlight effects en un solo componente, mouse-tracking via CSS vars.
 *
 * - mode="multi"  → un radial-gradient ambient sobre el contenedor
 *                   (estilo Linear, ilumina toda la grilla a la vez).
 * - mode="border" → borde de cada `.spot-target` se ilumina, local al cursor.
 * - mode="conic"  → conic-gradient que rota apuntando al cursor.
 * - mode="card"   → spotlight clásico (el más usado): radial-gradient SUAVE
 *                   dentro de cada `.spot-target`, color de marca.
 * - mode="vercel" → group-aware borders (estilo Vercel/Linear cards):
 *                   gradient grande compartido, cada card refleja la porción
 *                   más cercana al cursor en su propio borde.
 *
 * Para `multi` el listener vive en el contenedor; para el resto se actualizan
 * --mx / --my (y --angle en `conic`) en cada `.spot-target` con coords
 * relativas a sí mismo (radio grande = adyacentes también iluminan).
 */
import { useEffect, useRef } from "react";

type Mode = "multi" | "border" | "conic" | "card" | "vercel";

export function Spotlight({
  mode,
  className = "",
  children,
}: {
  mode: Mode;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {
      rafId = 0;
      if (mode === "multi") {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${lastX - r.left}px`);
        el.style.setProperty("--my", `${lastY - r.top}px`);
        return;
      }
      const targets = el.querySelectorAll<HTMLElement>(".spot-target");
      targets.forEach((t) => {
        const r = t.getBoundingClientRect();
        const x = lastX - r.left;
        const y = lastY - r.top;
        t.style.setProperty("--mx", `${x}px`);
        t.style.setProperty("--my", `${y}px`);
        if (mode === "conic") {
          const cx = r.width / 2;
          const cy = r.height / 2;
          // Ángulo desde el centro hacia el cursor (+90° para que 0deg apunte arriba)
          const angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
          t.style.setProperty("--angle", `${angle}deg`);
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId === 0) rafId = requestAnimationFrame(apply);
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mode]);

  return (
    <div
      ref={ref}
      className={`spotlight-${mode} ${className}`.trim()}
      data-spotlight={mode}
    >
      {children}
    </div>
  );
}
