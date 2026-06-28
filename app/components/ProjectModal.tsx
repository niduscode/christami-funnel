"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { type Proyecto, type MediaItem } from "@/app/lib/proyectos";

/**
 * Modal de proyecto + lightbox, reutilizable. Lo usa el Catálogo y la
 * Calculadora de presupuesto, para que al pinchar un proyecto se abra
 * AHÍ MISMO (sin tirar al usuario al catálogo). Maneja scroll-lock,
 * teclado (Esc / ← →) y swipe táctil. Controlado por `project`/`onClose`.
 */
export function ProjectModal({
  project,
  onClose,
  backLabel = "← Volver",
}: {
  project: Proyecto | null;
  onClose: () => void;
  backLabel?: string;
}) {
  const [lb, setLb] = useState<{ items: MediaItem[]; index: number } | null>(null);
  const touch = useRef({ x: 0, y: 0, active: false });

  // Bloquear scroll del body con modal o lightbox abiertos
  useEffect(() => {
    document.body.style.overflow = project || lb ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [project, lb]);

  // Si se cierra el proyecto, cerrar también el lightbox
  useEffect(() => {
    if (!project) setLb(null);
  }, [project]);

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb) {
        if (e.key === "Escape") setLb(null);
        else if (e.key === "ArrowLeft") navLb(-1);
        else if (e.key === "ArrowRight") navLb(1);
      } else if (project && e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function navLb(dir: number) {
    setLb((s) => (s ? { ...s, index: (s.index + dir + s.items.length) % s.items.length } : s));
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length !== 1) return;
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touch.current.active) return;
    touch.current.active = false;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) navLb(dx > 0 ? -1 : 1);
  }

  const lbItem = lb ? lb.items[lb.index] : null;

  return (
    <>
      {/* Modal de proyecto */}
      <div
        className={`project-modal${project ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de proyecto"
      >
        <button className="modal-close" aria-label="Cerrar" onClick={onClose}>
          ✕
        </button>
        {project && (
          <div className="modal-inner">
            <button className="modal-back" onClick={onClose}>
              {backLabel}
            </button>
            <div className="modal-header">
              <span className="modal-tag">{project.tag}</span>
              <h2 className="modal-title">{project.title}</h2>
              <p className="modal-desc">{project.description}</p>
            </div>
            <div className="modal-gallery">
              {project.media.map((m, idx) => (
                <div
                  key={m.src}
                  className={`gallery-item${m.type === "video" ? " is-video" : ""}`}
                  onClick={() => setLb({ items: project.media, index: idx })}
                >
                  {m.type === "video" ? (
                    <video src={m.src} muted loop playsInline preload="metadata" autoPlay />
                  ) : (
                    <img src={m.src} alt="" loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <div
        className={`lightbox${lb ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Visor de imágenes"
        onClick={(e) => {
          if (e.target === e.currentTarget) setLb(null);
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button className="lightbox-close" aria-label="Cerrar" onClick={() => setLb(null)}>
          ✕
        </button>
        <button className="lightbox-nav prev" aria-label="Anterior" onClick={() => navLb(-1)}>
          ‹
        </button>
        <button className="lightbox-nav next" aria-label="Siguiente" onClick={() => navLb(1)}>
          ›
        </button>
        <div className="lightbox-content">
          {lbItem &&
            (lbItem.type === "video" ? (
              <video src={lbItem.src} controls autoPlay playsInline />
            ) : (
              <img src={lbItem.src} alt="" />
            ))}
        </div>
        <div className="lightbox-counter">{lb ? `${lb.index + 1} / ${lb.items.length}` : ""}</div>
      </div>
    </>
  );
}
