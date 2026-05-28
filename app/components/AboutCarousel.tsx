"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { ABOUT_MEDIA, type AboutMedia } from "@/app/lib/oficina-taller";

// Duraciones (ms) — corta cada slide a estos tiempos exactos
const IMAGE_MS = 1200;   // 1.20s — fotos cortas
const VIDEO_MS = 3000;   // 3.00s — videos cortados, no esperan a terminar

/** Fisher–Yates shuffle (in-place sobre copia) */
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let k = out.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [out[k], out[j]] = [out[j], out[k]];
  }
  return out;
}

export function AboutCarousel() {
  // Orden inicial = el de la lista (para que el HTML SSR coincida con
  // el hidratado del cliente). Después del mount lo barajamos.
  const [media, setMedia] = useState<AboutMedia[]>(ABOUT_MEDIA);
  const [i, setI] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // Shuffle único al montar — cada visita al sitio ve un orden distinto
  useEffect(() => {
    setMedia((arr) => shuffle(arr));
    setI(0);
  }, []);

  // Avance automático: corta exacto a IMAGE_MS / VIDEO_MS
  useEffect(() => {
    if (media.length === 0) return;
    const cur = media[i];

    // Reproducir el video actual desde 0
    if (cur.type === "video") {
      const v = videoRefs.current[i];
      if (v) {
        try {
          v.currentTime = 0;
          v.play().catch(() => {});
        } catch {}
      }
    }

    // Pausar los demás videos
    media.forEach((m, idx) => {
      if (idx !== i && m.type === "video") {
        const v = videoRefs.current[idx];
        if (v) {
          try { v.pause(); } catch {}
        }
      }
    });

    const dur = cur.type === "video" ? VIDEO_MS : IMAGE_MS;
    const id = window.setTimeout(() => {
      setI((x) => (x + 1) % media.length);
    }, dur);
    return () => window.clearTimeout(id);
  }, [i, media]);

  return (
    <div className="about-image about-carousel reveal" style={{ position: "relative" }}>
      {media.map((m, idx) =>
        m.type === "video" ? (
          <video
            key={m.src}
            ref={(el) => { videoRefs.current[idx] = el; }}
            src={m.src}
            muted
            playsInline
            preload={idx === 0 ? "auto" : "metadata"}
            className={idx === i ? "is-active" : ""}
          />
        ) : (
          <img
            key={m.src}
            src={m.src}
            alt=""
            loading={idx === 0 ? "eager" : "lazy"}
            className={idx === i ? "is-active" : ""}
          />
        )
      )}
      <div className="about-badge">
        <strong>6</strong>
        <span>Años</span>
      </div>
    </div>
  );
}
