/**
 * Catálogo inicial. Fuente única de verdad para la grilla, el buscador, el carrito y los mensajes de WhatsApp.
 *
 * DATOS A CONFIRMAR POR LA TIENDA: nombres definitivos, precios (ARS), talles y descripciones.
 * Mientras `price` sea null, la tarjeta muestra «Precio a consultar».
 * Los nombres son descriptivos y salen de lo que se ve en cada fotografía.
 *
 * `fit`: las prendas recortadas (fondo transparente) van "contain" sobre el gris claro de la celda;
 * las fotografías completas (modelo, percha) van "cover".
 */

export type CategoryId = "tops" | "pantalones" | "noche" | "vestidos";

export type Category = {
  id: CategoryId;
  label: string;
  /** Línea breve bajo el título de la colección. Solo describe lo que hay en las fotos. */
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  category: Exclude<CategoryId, "vestidos">;
  /** Precio en pesos argentinos. null = «Precio a consultar». */
  price: number | null;
  sizes?: string[];
  description?: string;
  image: { src: string; alt: string; width: number; height: number; fit: "contain" | "cover"; position?: string };
};

export const categories: Category[] = [
  { id: "tops", label: "Tops", blurb: "Remeras oversize con estampas gráficas y de caligrafía." },
  { id: "pantalones", label: "Pantalones", blurb: "Jeans baggy y flare, y un pantalón camuflado." },
  { id: "vestidos", label: "Vestidos", blurb: "Consultá disponibilidad por WhatsApp." },
  { id: "noche", label: "Noche", blurb: "Tops de encaje para salir de noche." },
];

const cut = (name: string, w: number, h: number) => ({
  src: `/images/cutouts/${name}.webp`,
  width: w,
  height: h,
  fit: "contain" as const,
});

export const products: Product[] = [
  {
    id: "remera-cruz-negra",
    name: "Remera oversize negra con cruz",
    category: "tops",
    price: null,
    image: { ...cut("cruz", 820, 789), alt: "Remera oversize negra con una gran cruz gráfica en blanco" },
  },
  {
    id: "remera-cadena-cruces",
    name: "Remera oversize negra con cruces y cadena",
    category: "tops",
    price: null,
    image: { ...cut("cadena", 820, 657), alt: "Remera oversize negra con dos cruces unidas por una cadena, estampadas en blanco" },
  },
  {
    id: "remera-corazon-espinas",
    name: "Remera oversize negra con corazón de espinas",
    category: "tops",
    price: null,
    image: { ...cut("corazon", 820, 672), alt: "Remera oversize negra con un corazón de espinas y texto estampado en blanco" },
  },
  {
    id: "remera-cruces-mangas",
    name: "Remera oversize negra con cruces en las mangas",
    category: "tops",
    price: null,
    image: { ...cut("cruces", 820, 676), alt: "Remera oversize negra con cruces y caligrafía estampadas en blanco" },
  },
  {
    id: "remera-script-crema",
    name: "Remera oversize crema con caligrafía",
    category: "tops",
    price: null,
    image: { ...cut("crema", 820, 662), alt: "Remera oversize crema con estampa en caligrafía negra y detalles en las mangas" },
  },
  {
    id: "remera-script-marron",
    name: "Remera oversize marrón con caligrafía",
    category: "tops",
    price: null,
    image: { ...cut("marron", 820, 649), alt: "Remera oversize marrón con estampa en caligrafía blanca" },
  },
  {
    id: "jean-baggy-negro-rosa",
    name: "Jean baggy negro con estampa rosa",
    category: "pantalones",
    price: null,
    image: { ...cut("jeans-rosa", 783, 719), alt: "Jean baggy negro desteñido con estampa rosa en el bolsillo trasero" },
  },
  {
    id: "jean-baggy-negro",
    name: "Jean baggy negro desteñido",
    category: "pantalones",
    price: null,
    image: { ...cut("jeans-liso", 669, 719), alt: "Jean baggy negro con lavado desteñido" },
  },
  {
    id: "jean-flare-claro",
    name: "Jean flare de lavado claro",
    category: "pantalones",
    price: null,
    image: {
      src: "/images/products/flare-frente.webp",
      alt: "Modelo con jean flare de lavado claro y remera negra",
      width: 543,
      height: 724,
      fit: "cover",
      position: "50% 70%",
    },
  },
  {
    id: "pantalon-camuflado",
    name: "Pantalón camuflado con bordados",
    category: "pantalones",
    price: null,
    image: {
      src: "/images/products/camuflado.webp",
      alt: "Pantalón de corte holgado con estampa camuflada en grises y bordados blancos",
      width: 543,
      height: 724,
      fit: "cover",
    },
  },
  {
    id: "tops-encaje-tiras",
    name: "Tops de encaje con tiras",
    category: "noche",
    price: null,
    image: { ...cut("encaje-tiras", 618, 953), alt: "Tres tops de encaje con tiras en negro, blanco y marrón" },
  },
  {
    id: "tops-encaje-tubo",
    name: "Tops de encaje tipo tubo",
    category: "noche",
    price: null,
    image: { ...cut("encaje-tubo", 654, 970), alt: "Tres tops de encaje tipo tubo en negro, blanco y marrón" },
  },
  {
    id: "tops-encaje-mangas",
    name: "Tops de encaje de manga larga",
    category: "noche",
    price: null,
    image: {
      src: "/images/products/encaje-mangas.webp",
      alt: "Tres tops de encaje de manga larga colgados en perchas: negro, blanco y marrón",
      width: 960,
      height: 1280,
      fit: "cover",
    },
  },
];

/** Fotografías de apoyo editorial (portada y cierre de colecciones). */
export const editorial = {
  heroMain: {
    src: "/images/products/cadena-cruces.webp",
    alt: "Remera oversize negra con dos cruces unidas por una cadena, estampadas en blanco",
    width: 1500,
    height: 1500,
  },
  heroSecond: {
    src: "/images/products/encaje-tiras.webp",
    alt: "Tres tops de encaje con tiras en negro, blanco y marrón",
    width: 960,
    height: 1280,
  },
  spreadA: {
    src: "/images/products/bermuda.webp",
    alt: "Modelo con bermuda de jean con brillos y remera azul oscura",
    width: 771,
    height: 1000,
  },
  spreadB: {
    src: "/images/products/baggy-claro.webp",
    alt: "Modelo con jean baggy de lavado claro y bordado en la pierna, remera blanca",
    width: 928,
    height: 811,
  },
};

/**
 * Lookbook horizontal: solo fotografías reales de la tienda, a distintos tamaños y alturas.
 * `lag` es cuánto se retrasa o adelanta cada foto respecto del avance del scroll (efecto de capas).
 */
export const lookbook = [
  { src: "/images/products/cadena-cruces.webp", alt: "Remera oversize negra con cruces y cadena en blanco", width: 1500, height: 1500, size: 64, lift: 0, lag: 0 },
  { src: "/images/products/mangas-largas.webp", alt: "Remeras de manga larga en colores lisos, colgadas en una percha", width: 960, height: 1280, size: 52, lift: 14, lag: 0.12 },
  { src: "/images/products/bermuda.webp", alt: "Modelo con bermuda de jean con brillos y remera azul oscura", width: 771, height: 1000, size: 60, lift: 4, lag: -0.08 },
  { src: "/images/products/negro-rosa-espalda.webp", alt: "Detalle del bolsillo trasero de un jean negro con estampa rosa", width: 1024, height: 1280, size: 46, lift: 22, lag: 0.16 },
  { src: "/images/products/flare-espalda.webp", alt: "Modelo de espaldas con jean flare de lavado claro", width: 543, height: 724, size: 58, lift: 0, lag: -0.1 },
  { src: "/images/products/baggy-claro.webp", alt: "Modelo con jean baggy de lavado claro y bordado en la pierna", width: 928, height: 811, size: 40, lift: 18, lag: 0.1 },
  { src: "/images/products/encaje-mangas.webp", alt: "Tops de encaje de manga larga colgados en una percha", width: 960, height: 1280, size: 62, lift: 2, lag: -0.06 },
  { src: "/images/products/camuflado.webp", alt: "Pantalón camuflado con bordados, colgado", width: 543, height: 724, size: 50, lift: 12, lag: 0.14 },
];

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number | null) {
  return price === null ? "Precio a consultar" : priceFormatter.format(price);
}
