"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { ABOUT_MEDIA, type AboutMedia } from "@/app/lib/oficina-taller";

// Duraciones (ms) — corta cada slide a estos tiempos exactos
const IMAGE_MS = 1500;   // 1.50s — fotos más holgadas, transición se nota
const VIDEO_MS = 3000;   // 3.00s — videos cortados, no esperan a terminar

// Subset máximo del total de media: con 65 videos el navegador
// no puede preloadear todos a la vez. 18 alcanza para variedad
// y evita colgar Safari.
const MAX_ITEMS = 18;

/** Fisher–Yates shuffle (out-of-place) */
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let k = out.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [out[k], out[j]] = [out[j], out[k]];
  }
  return out;
}

/**
 * Estrategia de slots PERSISTENTES (keys estables "A" y "B"):
 * El bug anterior era que keys cur-${i} y next-${nextI} cambiaban en
 * cada transición → ambos <video> se desmontaban y se volvían a montar.
 * El "preload" del slot next se perdía porque ese DOM ya no existía
 * cuando le tocaba ser activo. Resultado: pantalla negra entre slides.
 *
 * Ahora: dos slots A y B con keys que NO cambian. Cada uno tiene su
 * propio índice en la playlist. Mientras uno reproduce (activo), el
 * otro carga el siguiente (preload). Al swap, el que estaba cargando
 * ya tiene el primer frame listo → handoff suave.
 */
export function AboutCarousel() {
  const [playlist, setPlaylist] = useState<AboutMedia[]>(
    () => ABOUT_MEDIA.slice(0, MAX_ITEMS)
  );

  // Índices de cada slot en la playlist y cuál está activo
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(1);
  const [active, setActive] = useState<"A" | "B">("A");

  const refA = useRef<HTMLVideoElement | null>(null);
  const refB = useRef<HTMLVideoElement | null>(null);

  // Shuffle inicial post-mount
  useEffect(() => {
    const sh = shuffle(ABOUT_MEDIA).slice(0, MAX_ITEMS);
    setPlaylist(sh);
    setIdxA(0);
    setIdxB(Math.min(1, sh.length - 1));
    setActive("A");
  }, []);

  // Avance + control de playback
  useEffect(() => {
    if (playlist.length === 0) return;
    const curMedia = active === "A" ? playlist[idxA] : playlist[idxB];
    if (!curMedia) return;

    // Reproducir el video activo desde 0
    const curRef = active === "A" ? refA.current : refB.current;
    if (curMedia.type === "video" && curRef) {
      try {
        curRef.currentTime = 0;
        // play() devuelve Promise — la atrapamos para que iOS no warn
        const p = curRef.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch {}
    }

    const dur = curMedia.type === "video" ? VIDEO_MS : IMAGE_MS;
    const id = window.setTimeout(() => {
      // Swap: el slot inactivo carga el siguiente, activo cambia.
      if (active === "A") {
        // B será el nuevo activo (ya estaba precargando idxB).
        // A pasa a cargar el siguiente para tenerlo listo cuando le toque.
        setIdxA((idxB + 1) % playlist.length);
        setActive("B");
      } else {
        setIdxB((idxA + 1) % playlist.length);
        setActive("A");
      }
    }, dur);
    return () => window.clearTimeout(id);
  }, [active, idxA, idxB, playlist]);

  if (playlist.length === 0) return null;

  const mediaA = playlist[idxA];
  const mediaB = playlist[idxB];

  return (
    <div className="about-image phone-mockup reveal" style={{ position: "relative" }}>
      <div className="phone-mockup-screen about-carousel">
        {mediaA && (
          <MediaSlot
            key="A"
            media={mediaA}
            active={active === "A"}
            videoRef={refA}
          />
        )}
        {mediaB && (
          <MediaSlot
            key="B"
            media={mediaB}
            active={active === "B"}
            videoRef={refB}
          />
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iphone-mockup.png"
        alt=""
        className="phone-mockup-frame"
        aria-hidden
      />
      <div className="about-badge">
        <strong>6</strong>
        <span>Años</span>
      </div>
    </div>
  );
}

function MediaSlot({
  media,
  active,
  videoRef,
}: {
  media: AboutMedia;
  active: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  // preload="auto" en AMBOS slots: con keys estables, los <video> persisten
  // y el slot inactivo va cargando en paralelo. Cuando le toque activo,
  // el primer frame ya está decodificado → no más pantalla negra.
  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        src={media.src}
        muted
        playsInline
        preload="auto"
        className={active ? "is-active" : ""}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt=""
      loading="eager"
      className={active ? "is-active" : ""}
    />
  );
}
