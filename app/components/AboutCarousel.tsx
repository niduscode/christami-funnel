"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { ABOUT_MEDIA, type AboutMedia } from "@/app/lib/oficina-taller";

// Duraciones (ms) — corta cada slide a estos tiempos exactos
const IMAGE_MS = 1200;   // 1.20s — fotos cortas
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

export function AboutCarousel() {
  // playlist inicial = primeros N items del original (matchea SSR).
  // Después del mount lo barajamos y tomamos un subset random distinto
  // en cada carga.
  const [playlist, setPlaylist] = useState<AboutMedia[]>(
    () => ABOUT_MEDIA.slice(0, MAX_ITEMS)
  );
  const [i, setI] = useState(0);
  const [nextI, setNextI] = useState(1);

  // Refs separados para los dos slots (current/next) para precargar
  const currVidRef = useRef<HTMLVideoElement | null>(null);
  const nextVidRef = useRef<HTMLVideoElement | null>(null);

  // Shuffle inicial post-mount
  useEffect(() => {
    setPlaylist(shuffle(ABOUT_MEDIA).slice(0, MAX_ITEMS));
    setI(0);
    setNextI(1);
  }, []);

  // Avance del carrusel + control de playback de videos
  useEffect(() => {
    if (playlist.length === 0) return;
    const cur = playlist[i];

    // Reproducir el video actual (si lo es) desde 0
    if (cur.type === "video" && currVidRef.current) {
      try {
        currVidRef.current.currentTime = 0;
        currVidRef.current.play().catch(() => {});
      } catch {}
    }

    const dur = cur.type === "video" ? VIDEO_MS : IMAGE_MS;
    const id = window.setTimeout(() => {
      setI((x) => (x + 1) % playlist.length);
      setNextI((x) => (x + 1) % playlist.length);
    }, dur);
    return () => window.clearTimeout(id);
  }, [i, playlist]);

  if (playlist.length === 0) return null;

  const curMedia = playlist[i];
  const nextMedia = playlist[nextI];

  return (
    <div className="about-image about-carousel reveal" style={{ position: "relative" }}>
      {/* SLOT ACTIVO — visible */}
      <MediaSlot
        key={`cur-${i}`}
        media={curMedia}
        active
        videoRef={curVidRef}
        preload="auto"
      />
      {/* SLOT NEXT — invisible, precarga el siguiente. Esto permite
          que la transición no tenga "popping" porque el media ya está
          en memoria del browser cuando le toca su turno. */}
      <MediaSlot
        key={`next-${nextI}`}
        media={nextMedia}
        active={false}
        videoRef={nextVidRef}
        preload="metadata"
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
  preload,
}: {
  media: AboutMedia;
  active: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  preload: "auto" | "metadata" | "none";
}) {
  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        src={media.src}
        muted
        playsInline
        preload={preload}
        className={active ? "is-active" : ""}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt=""
      loading={active ? "eager" : "lazy"}
      className={active ? "is-active" : ""}
    />
  );
}
