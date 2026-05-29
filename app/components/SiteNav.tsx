"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["/#nosotros", "Nosotros"],
  ["/#servicios", "Servicios"],
  ["/#catalogo", "Catálogo"],
  ["/#contacto", "Contacto"],
] as const;

/** `solid` fuerza el estilo opaco (para páginas sin hero como /gracias o /privacidad). */
export function SiteNav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC cierra el menú cuando está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className={`topbar${scrolled || solid ? " scrolled" : ""}`} id="topbar">
        <div className="nav-wrap">
          <a href="/" className="brand" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Logo Mueblería Christami" className="brand-logo" />
            <div className="brand-text">
              Christami
              <small>Mueblería</small>
            </div>
          </a>
          <ul className={`nav-links${open ? " open" : ""}`} id="navLinks">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/#cotizar"
                className="nav-cta"
                onClick={() => setOpen(false)}
              >
                Cotiza tu proyecto
              </a>
            </li>
          </ul>
          <button
            className={`menu-toggle${open ? " is-open" : ""}`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              // ✕
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              // ☰
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>
      {/* Backdrop transparente: clic fuera del menú lo cierra */}
      <div
        className={`nav-backdrop${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
    </>
  );
}
