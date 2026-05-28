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

  return (
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
          className="menu-toggle"
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
