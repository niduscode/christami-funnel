"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { proyectos, categoryLabels } from "@/app/lib/proyectos";
import { Spotlight } from "@/app/components/Spotlight";
import { ProjectModal } from "@/app/components/ProjectModal";

export function Catalogo() {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const project = proyectos.find((p) => p.id === openId) ?? null;

  const counts = proyectos.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const usedCats = Object.keys(counts);
  const visibleCount =
    filter === "all" ? proyectos.length : proyectos.filter((p) => p.category === filter).length;

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

      <ProjectModal
        project={project}
        onClose={() => setOpenId(null)}
        backLabel="← Volver al catálogo"
      />
    </section>
  );
}
