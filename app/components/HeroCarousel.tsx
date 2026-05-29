"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  { img: "/assets/PROTECTO%20%232%20COCINA/PROYECTO%20%232.jpeg", kb: "kb-pan-right" },
  { img: "/assets/PROTECTO%20%231%20COCINA/PROYECTO%20%231.jpeg", kb: "kb-zoom-in" },
  { img: "/assets/PROYECTO%20%237%20CLOSET/PHOTO-2026-01-15-18-13-04.jpg", kb: "kb-pan-left" },
  { img: "/assets/PROYECTO%20%238%20MUEBLE%20LIVING/PHOTO-2026-03-10-14-45-44.jpg", kb: "kb-diagonal" },
  { img: "/assets/PROTECTO%20%233%20COCINA/PROYECTO%20%233.jpg", kb: "kb-zoom-out" },
];
const SLIDE_DURATION = 6500;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  // Auto-cycle (se reinicia al cambiar de slide manual o automáticamente)
  useEffect(() => {
    const advance = () => setCurrent((c) => (c + 1) % SLIDES.length);
    let id = window.setInterval(advance, SLIDE_DURATION);
    const onVis = () => {
      clearInterval(id);
      if (!document.hidden) id = window.setInterval(advance, SLIDE_DURATION);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [current]);

  // Barra de progreso
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - start) / SLIDE_DURATION, 1) * 100;
      if (barRef.current) barRef.current.style.width = pct + "%";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current]);

  // Parallax suave del carrusel
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight && carRef.current) {
        carRef.current.style.transform = `translateY(${y * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hero">
      <div className="hero-carousel" id="heroCarousel" ref={carRef}>
        {SLIDES.map((s, i) => (
          <div
            key={s.img}
            className={`hero-slide ${s.kb}${i === current ? " active" : ""}`}
            style={{ backgroundImage: `url('${s.img}')` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-eyebrow">Mueblería · Región de Los Lagos</div>
        <h1>
          Diseño y carpintería <em>con alma artesanal</em>
        </h1>
        <p className="lead">
          Muebles a medida pensados para tu hogar. Cocinas, closets, dormitorios y más — cada
          proyecto único, fabricado por nosotros con materiales de primera.
        </p>
        <div className="hero-cta-row">
          <a href="#catalogo" className="btn btn-primary">
            Ver catálogo
          </a>
          <a href="#cotizar" className="btn btn-accent">
            Cotiza tu proyecto
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden>
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
      <div className="hero-dots" role="tablist" aria-label="Galería principal">
        {SLIDES.map((s, i) => (
          <button
            key={s.img}
            className={`hero-dot${i === current ? " active" : ""}`}
            role="tab"
            aria-label={`Ir a foto ${i + 1}`}
            aria-selected={i === current}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
      <div className="hero-progress">
        <div className="hero-progress-bar" ref={barRef} />
      </div>
      <div className="scroll-indicator">Desliza</div>
    </header>
  );
}
