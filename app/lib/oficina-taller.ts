/**
 * Media de "oficina/taller" — fotos del local + segmentos de videos cortos
 * sin audio, hechos para el carrusel de Nosotros.
 *
 * Lista generada a partir del contenido de public/assets/oficina-taller/.
 * Si agregás/quitás archivos ahí, regenerá esta lista.
 */
export type AboutMedia = {
  src: string;
  type: "image" | "video";
};

// 7 fotos del taller (1.2s c/u)
const IMAGES: string[] = [
  "/assets/oficina-taller/img-01.jpg",
  "/assets/oficina-taller/img-02.jpg",
  "/assets/oficina-taller/img-03.jpg",
  "/assets/oficina-taller/img-04.jpg",
  "/assets/oficina-taller/img-05.jpg",
  "/assets/oficina-taller/img-06.jpg",
  "/assets/oficina-taller/img-07.jpg",
];

// 65 segmentos de video (5s c/u). Provienen de 11 videos originales
// partidos por ffmpeg (segment muxer) y sin audio.
const VIDEOS: string[] = [
  "/assets/oficina-taller/vid-01-000.mp4",
  "/assets/oficina-taller/vid-01-001.mp4",
  "/assets/oficina-taller/vid-01-002.mp4",
  "/assets/oficina-taller/vid-02-000.mp4",
  "/assets/oficina-taller/vid-02-001.mp4",
  "/assets/oficina-taller/vid-02-002.mp4",
  "/assets/oficina-taller/vid-02-003.mp4",
  "/assets/oficina-taller/vid-02-004.mp4",
  "/assets/oficina-taller/vid-02-005.mp4",
  "/assets/oficina-taller/vid-02-006.mp4",
  "/assets/oficina-taller/vid-02-007.mp4",
  "/assets/oficina-taller/vid-02-008.mp4",
  "/assets/oficina-taller/vid-03-000.mp4",
  "/assets/oficina-taller/vid-03-001.mp4",
  "/assets/oficina-taller/vid-04-000.mp4",
  "/assets/oficina-taller/vid-05-000.mp4",
  "/assets/oficina-taller/vid-05-001.mp4",
  "/assets/oficina-taller/vid-05-002.mp4",
  "/assets/oficina-taller/vid-05-003.mp4",
  "/assets/oficina-taller/vid-05-004.mp4",
  "/assets/oficina-taller/vid-06-000.mp4",
  "/assets/oficina-taller/vid-06-001.mp4",
  "/assets/oficina-taller/vid-06-002.mp4",
  "/assets/oficina-taller/vid-06-003.mp4",
  "/assets/oficina-taller/vid-06-004.mp4",
  "/assets/oficina-taller/vid-06-005.mp4",
  "/assets/oficina-taller/vid-06-006.mp4",
  "/assets/oficina-taller/vid-06-007.mp4",
  "/assets/oficina-taller/vid-06-008.mp4",
  "/assets/oficina-taller/vid-06-009.mp4",
  "/assets/oficina-taller/vid-06-010.mp4",
  "/assets/oficina-taller/vid-06-011.mp4",
  "/assets/oficina-taller/vid-06-012.mp4",
  "/assets/oficina-taller/vid-06-013.mp4",
  "/assets/oficina-taller/vid-06-014.mp4",
  "/assets/oficina-taller/vid-07-000.mp4",
  "/assets/oficina-taller/vid-07-001.mp4",
  "/assets/oficina-taller/vid-07-002.mp4",
  "/assets/oficina-taller/vid-07-003.mp4",
  "/assets/oficina-taller/vid-07-004.mp4",
  "/assets/oficina-taller/vid-07-005.mp4",
  "/assets/oficina-taller/vid-07-006.mp4",
  "/assets/oficina-taller/vid-07-007.mp4",
  "/assets/oficina-taller/vid-08-000.mp4",
  "/assets/oficina-taller/vid-08-001.mp4",
  "/assets/oficina-taller/vid-08-002.mp4",
  "/assets/oficina-taller/vid-08-003.mp4",
  "/assets/oficina-taller/vid-09-000.mp4",
  "/assets/oficina-taller/vid-09-001.mp4",
  "/assets/oficina-taller/vid-09-002.mp4",
  "/assets/oficina-taller/vid-09-003.mp4",
  "/assets/oficina-taller/vid-09-004.mp4",
  "/assets/oficina-taller/vid-09-005.mp4",
  "/assets/oficina-taller/vid-10-000.mp4",
  "/assets/oficina-taller/vid-10-001.mp4",
  "/assets/oficina-taller/vid-10-002.mp4",
  "/assets/oficina-taller/vid-10-003.mp4",
  "/assets/oficina-taller/vid-10-004.mp4",
  "/assets/oficina-taller/vid-10-005.mp4",
  "/assets/oficina-taller/vid-11-000.mp4",
  "/assets/oficina-taller/vid-11-001.mp4",
  "/assets/oficina-taller/vid-11-002.mp4",
  "/assets/oficina-taller/vid-11-003.mp4",
  "/assets/oficina-taller/vid-11-004.mp4",
  "/assets/oficina-taller/vid-11-005.mp4",
];

/**
 * Intercala imágenes y videos para que el carrusel alterne ritmos:
 * un video de 5s, luego una imagen de 1.2s, luego un video, etc.
 * Si hay más videos que imágenes (caso actual: 65 vs 7), las imágenes
 * se distribuyen uniformemente entre los videos.
 */
function interleave(): AboutMedia[] {
  const out: AboutMedia[] = [];
  const step = Math.max(1, Math.floor(VIDEOS.length / IMAGES.length));
  let imgIdx = 0;
  for (let i = 0; i < VIDEOS.length; i++) {
    out.push({ src: VIDEOS[i], type: "video" });
    if (i > 0 && i % step === 0 && imgIdx < IMAGES.length) {
      out.push({ src: IMAGES[imgIdx], type: "image" });
      imgIdx++;
    }
  }
  // Las imágenes que sobren las agregamos al final
  while (imgIdx < IMAGES.length) {
    out.push({ src: IMAGES[imgIdx++], type: "image" });
  }
  return out;
}

export const ABOUT_MEDIA: AboutMedia[] = interleave();
