"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { cuarzos, lineaCuarzoLabels, type Cuarzo, type LineaCuarzo } from "@/app/lib/cuarzos";
import { formatCLP } from "@/app/lib/precios";
import { plainWaLink } from "@/app/lib/whatsapp";
import { Spotlight } from "@/app/components/Spotlight";
import { WaLink } from "@/app/components/WaLink";

type Filtro = "all" | LineaCuarzo;

function QuartzModal({
  cuarzo,
  onClose,
}: {
  cuarzo: Cuarzo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = cuarzo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cuarzo]);

  useEffect(() => {
    if (!cuarzo) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cuarzo, onClose]);

  return (
    <div
      className={`project-modal quartz-modal${cuarzo ? " active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={cuarzo ? `Detalle del cuarzo ${cuarzo.nombre}` : "Detalle de cuarzo"}
    >
      <button className="modal-close" aria-label="Cerrar" onClick={onClose}>
        ✕
      </button>

      {cuarzo && (
        <div className="modal-inner quartz-modal-inner">
          <button className="modal-back" onClick={onClose}>
            ← Volver a los cuarzos
          </button>

          <div className="quartz-modal-layout">
            <div className="quartz-modal-visual">
              <img
                className="quartz-modal-ambient"
                src={cuarzo.ambiente}
                alt={`Ambiente con cuarzo ${cuarzo.nombre}`}
              />
              <div className="quartz-modal-swatch">
                <img src={cuarzo.muestra} alt={`Muestra de ${cuarzo.nombre}`} />
                <span>Detalle del acabado</span>
              </div>
            </div>

            <div className="quartz-modal-copy">
              <span className="modal-tag">{lineaCuarzoLabels[cuarzo.linea]}</span>
              <h2 className="modal-title">{cuarzo.nombre}</h2>
              <p className="modal-desc">{cuarzo.descripcion}</p>

              <div className="quartz-composition">
                <span>Composición</span>
                <strong>93% piedra de cuarzo · 7% resina</strong>
              </div>

              <div className="quartz-price-grid">
                <div className="quartz-price-card">
                  <span>Plancha completa</span>
                  <strong>{formatCLP(cuarzo.precioPlancha)}</strong>
                  <small>Formato 3,2 × 1,6 m</small>
                </div>
                <div className="quartz-price-card featured">
                  <span>Metro lineal</span>
                  <strong>{formatCLP(cuarzo.precioMetroLineal)}</strong>
                  <small>Con 60 cm de profundidad</small>
                </div>
              </div>

              <p className="quartz-price-note">
                El valor final se confirma según medidas, cortes, terminaciones e instalación.
              </p>

              <div className="quartz-modal-actions">
                <a className="btn-primary quartz-quote-btn" href="/#cotizar" onClick={onClose}>
                  Cotizar con este cuarzo
                </a>
                <WaLink
                  className="quartz-wa-btn"
                  href={plainWaLink(
                    `Hola Mueblería Christami, quiero cotizar un proyecto con cuarzo ${cuarzo.nombre}.`
                  )}
                  source={`quartz-${cuarzo.id}`}
                >
                  Consultar por WhatsApp
                </WaLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuartzCatalog() {
  const [filter, setFilter] = useState<Filtro>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = cuarzos.find((cuarzo) => cuarzo.id === openId) ?? null;

  const counts = cuarzos.reduce<Record<LineaCuarzo, number>>(
    (acc, cuarzo) => {
      acc[cuarzo.linea] += 1;
      return acc;
    },
    { basica: 0, premium: 0 }
  );

  const filters: { id: Filtro; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: cuarzos.length },
    { id: "basica", label: "Línea básica", count: counts.basica },
    { id: "premium", label: "Línea premium", count: counts.premium },
  ];

  return (
    <section className="block quartz-catalog" id="cuarzos">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Cubiertas y superficies</div>
          <h2 className="section-title">
            Catálogo de <em>cuarzos</em>
          </h2>
          <p className="section-sub">
            Explora colores, vetas y terminaciones. Abre cada diseño para ver su acabado,
            composición y valores de referencia.
          </p>
        </div>

        <div className="filter-bar reveal">
          {filters.map((item) => (
            <button
              key={item.id}
              className={`filter-btn${filter === item.id ? " active" : ""}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label} <span className="count">{item.count}</span>
            </button>
          ))}
        </div>

        <Spotlight mode="vercel" className="catalog-grid quartz-grid reveal-stagger">
          {cuarzos.map((cuarzo) => {
            const hidden = filter !== "all" && cuarzo.linea !== filter;
            return (
              <article
                key={cuarzo.id}
                className={`catalog-card quartz-card spot-target${hidden ? " hidden" : ""}`}
                role="button"
                tabIndex={hidden ? -1 : 0}
                aria-label={`Ver cuarzo ${cuarzo.nombre}`}
                onClick={() => setOpenId(cuarzo.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setOpenId(cuarzo.id);
                  }
                }}
              >
                <img
                  className="quartz-card-cover"
                  src={cuarzo.ambiente}
                  alt={`Ambiente con cuarzo ${cuarzo.nombre}`}
                  loading="lazy"
                />
                <img
                  className="quartz-card-swatch"
                  src={cuarzo.muestra}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <div className="catalog-card-overlay quartz-card-overlay">
                  <span className="card-tag">{lineaCuarzoLabels[cuarzo.linea]}</span>
                  <h3 className="card-title">{cuarzo.nombre}</h3>
                  <p className="quartz-card-price">
                    Desde {formatCLP(cuarzo.precioMetroLineal)} <small>/ metro lineal</small>
                  </p>
                  <span className="card-cta">Ver acabado y precios →</span>
                </div>
              </article>
            );
          })}
        </Spotlight>
      </div>

      <QuartzModal cuarzo={selected} onClose={() => setOpenId(null)} />
    </section>
  );
}

