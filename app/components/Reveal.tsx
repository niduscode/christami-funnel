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

    // bfcache: al volver atrás (p.ej. desde WhatsApp) el navegador restaura
    // la página CONGELADA y el IntersectionObserver no se vuelve a disparar,
    // así que las secciones que quedaron en opacity:0 se veían en blanco.
    // En una restauración desde caché, revelamos todo de inmediato.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      document
        .querySelectorAll(".reveal, .reveal-stagger")
        .forEach((el) => el.classList.add("in-view"));
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      io.disconnect();
      counterIO.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
