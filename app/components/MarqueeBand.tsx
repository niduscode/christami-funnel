/**
 * Tira en marquee con nombres de materiales, acabados y tipos de muebles.
 * 40s de recorrido (lento, para que se lea bien). Sin JS: la animación es
 * pura CSS y duplicamos el contenido para que el loop sea seamless.
 *
 * El estilo lo levantamos en catalogo.css → `.marquee-band` y `.marquee-track`.
 */
const ITEMS: string[] = [
  // Melaminas con textura / acabados
  "Melamina Premium",
  "Roble Antracita",
  "Roble Avellana",
  "Tuare Azul",
  "Verde Jades",
  "Pacífico",
  "Santorini",
  "Tokai",
  "Taupe",
  "Valle",
  "Madrid",
  "Marfil",
  // Cubiertas y cuarzos
  "Cuarzo Estelar",
  "Cuarzo Galaxy",
  "Cuarzo Marfil",
  "Cubierta Galaxy",
  "Fintop",
  // Acabados
  "Mate",
  "Texturado",
  "Perfiles de aluminio",
  "Luz LED integrada",
  "Herrajes Blum",
  // Muebles / tipos
  "Cocinas a medida",
  "Closets",
  "Vestidores",
  "Aéreos iluminados",
  "Islas",
  "Penínsulas",
  "Veladores",
  "Racks de TV",
  "Vanitorios",
  "Escritorios",
  "Vitrinas",
  "Logias",
];

export function MarqueeBand() {
  // Renderizamos el set 2 veces seguidas: el keyframe va de 0 a -50%
  // sobre el ancho total, así nunca se ve un "salto".
  return (
    <div className="marquee-band" aria-hidden role="presentation">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((label, i) => (
          <span className="marquee-item" key={`${label}-${i}`}>
            <span className="marquee-text">{label}</span>
            <span className="marquee-sep" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
