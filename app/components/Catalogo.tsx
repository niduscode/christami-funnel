"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { proyectos, categoryLabels, type MediaItem } from "@/app/lib/proyectos";
import { Spotlight } from "@/app/components/Spotlight";

export function Catalogo() {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [lb, setLb] = useState<{ items: MediaItem[]; index: number } | null>(null);
  const touch = useRef({ x: 0, y: 0, active: false });

  const project = proyectos.find((p) => p.id === openId) ?? null;

  const counts = proyectos.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const usedCats = Object.keys(counts);
  const visibleCount =
    filter === "all" ? proyectos.length : proyectos.filter((p) => p.category === filter).length;

  // Bloquear scroll del body cuando hay modal o lightbox
  useEffect(() => {
    document.body.style.overflow = openId || lb ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId, lb]);

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb) {
        if (e.key === "Escape") setLb(null);
        else if (e.key === "ArrowLeft") navLb(-1);
        else if (e.key === "ArrowRight") navLb(1);
      } else if (openId && e.key === "Escape") {
        setOpenId(null);
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
    <section className="block catalog" id="catalogo">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Catálogo</div>
          <h2 className="section-title">
            Nuestros <em>proyectos</em>
          </h2>
          <p className="section-sub">
            Cada mueble es único. Filtra por categoría y haz click en un proyecto para ver todas
            las fotos y la descripción completa.
          </p>
        </div>

        <div className="filter-bar reveal">
          <button
            className={`filter-btn${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos <span className="count">{proyectos.length}</span>
          </button>
          {usedCats.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${filter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {categoryLabels[cat] || cat} <span className="count">{counts[cat]}</span>
            </button>
          ))}
        </div>

        <Spotlight mode="vercel" className="catalog-grid reveal-stagger">
          {proyectos.map((p) => {
            const hidden = filter !== "all" && p.category !== filter;
            return (
              <article
                key={p.id}
                className={`catalog-card spot-target${hidden ? " hidden" : ""}`}
                onClick={() => setOpenId(p.id)}
              >
                <img src={p.cover} alt={p.tag} loading="lazy" />
                <div className="card-media-count">
                  {p.media.length} {p.media.length === 1 ? "archivo" : "archivos"}
                </div>
                <div className="catalog-card-overlay">
                  <span className="card-tag">{p.tag}</span>
                  <h3
                    className={`card-title${
                      p.title.length > 50
                        ? " card-title--xs"
                        : p.title.length > 32
                        ? " card-title--sm"
                        : ""
                    }`}
                  >
                    {p.title}
                  </h3>
                  <span className="card-cta">Ver proyecto →</span>
                </div>
              </article>
            );
          })}
          {visibleCount === 0 && (
            <div className="card-empty">Aún no hay proyectos en esta categoría.</div>
          )}
        </Spotlight>
      </div>

      {/* Modal de proyecto */}
      <div
        className={`project-modal${openId ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de proyecto"
      >
        <button className="modal-close" aria-label="Cerrar" onClick={() => setOpenId(null)}>
          ✕
        </button>
        {project && (
          <div className="modal-inner">
            <button className="modal-back" onClick={() => setOpenId(null)}>
              ← Volver al catálogo
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
    </section>
  );
}
