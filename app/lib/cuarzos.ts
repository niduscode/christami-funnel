export type LineaCuarzo = "basica" | "premium";

export type Cuarzo = {
  id: string;
  nombre: string;
  linea: LineaCuarzo;
  descripcion: string;
  ambiente: string;
  muestra: string;
  precioPlancha: number;
  precioMetroLineal: number;
};

const ASSET = "/assets/cuarzos";

export const cuarzos: Cuarzo[] = [
  {
    id: "blanco-galaxy",
    nombre: "Blanco Galaxy",
    linea: "basica",
    descripcion: "Base blanca con destellos brillantes tipo espejo.",
    ambiente: `${ASSET}/blanco-galaxy-ambiente.jpg`,
    muestra: `${ASSET}/blanco-galaxy-muestra.jpg`,
    precioPlancha: 520_000,
    precioMetroLineal: 210_000,
  },
  {
    id: "blanco-snow",
    nombre: "Blanco Snow",
    linea: "basica",
    descripcion: "Base blanca de grano ultra fino y sin destellos.",
    ambiente: `${ASSET}/blanco-snow-ambiente.jpg`,
    muestra: `${ASSET}/blanco-snow-muestra.jpg`,
    precioPlancha: 520_000,
    precioMetroLineal: 210_000,
  },
  {
    id: "blanco-estelar",
    nombre: "Blanco Estelar",
    linea: "basica",
    descripcion: "Base blanca de grano ultra fino con pequeños destellos.",
    ambiente: `${ASSET}/blanco-estelar-ambiente.jpg`,
    muestra: `${ASSET}/blanco-estelar-muestra.jpg`,
    precioPlancha: 520_000,
    precioMetroLineal: 210_000,
  },
  {
    id: "gris-galaxy",
    nombre: "Gris Galaxy",
    linea: "basica",
    descripcion: "Base gris con sutiles destellos brillantes tipo espejo.",
    ambiente: `${ASSET}/gris-galaxy-ambiente.jpg`,
    muestra: `${ASSET}/gris-galaxy-muestra.jpg`,
    precioPlancha: 520_000,
    precioMetroLineal: 210_000,
  },
  {
    id: "negro-estelar",
    nombre: "Negro Estelar",
    linea: "basica",
    descripcion: "Base negra de grano ultra fino con pequeños destellos.",
    ambiente: `${ASSET}/negro-estelar-ambiente.jpg`,
    muestra: `${ASSET}/negro-estelar-muestra.jpg`,
    precioPlancha: 520_000,
    precioMetroLineal: 210_000,
  },
  {
    id: "calacatta",
    nombre: "Calacatta",
    linea: "premium",
    descripcion: "Base blanca con vetas grises gruesas.",
    ambiente: `${ASSET}/calacatta-ambiente.jpg`,
    muestra: `${ASSET}/calacatta-muestra.jpg`,
    precioPlancha: 800_000,
    precioMetroLineal: 280_000,
  },
  {
    id: "calacatta-gold",
    nombre: "Calacatta Gold",
    linea: "premium",
    descripcion: "Base blanca con vetas doradas gruesas.",
    ambiente: `${ASSET}/calacatta-gold-ambiente.jpg`,
    muestra: `${ASSET}/calacatta-gold-muestra.jpg`,
    precioPlancha: 800_000,
    precioMetroLineal: 280_000,
  },
  {
    id: "marquina",
    nombre: "Marquina",
    linea: "premium",
    descripcion: "Base negra con vetas blancas finas y lineales.",
    ambiente: `${ASSET}/marquina-ambiente.jpg`,
    muestra: `${ASSET}/marquina-muestra.jpg`,
    precioPlancha: 800_000,
    precioMetroLineal: 280_000,
  },
];

export const lineaCuarzoLabels: Record<LineaCuarzo, string> = {
  basica: "Línea básica",
  premium: "Línea premium",
};

