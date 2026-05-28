"use client";

import { useEffect } from "react";

/**
 * Activa las animaciones de aparición (.reveal / .reveal-stagger) y los
 * contadores ([data-counter]) del catálogo. No renderiza nada.
 */
export function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => io.observe(el));

    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = parseInt(el.dataset.counter || "0", 10);
          const suffix = el.dataset.suffix || "";
          const duration = 1600;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
          };
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-counter]").forEach((c) => counterIO.observe(c));

    return () => {
      io.disconnect();
      counterIO.disconnect();
    };
  }, []);

  return null;
}
