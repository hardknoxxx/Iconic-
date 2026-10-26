/**
 * Catálogo inicial. Fuente única de verdad para tarjetas, categorías y mensajes de WhatsApp.
 *
 * DATOS A CONFIRMAR POR LA TIENDA: nombres definitivos, precios (ARS), talles y descripciones.
 * Mientras `price` sea null, la tarjeta muestra «Precio a consultar».
 * Los nombres son descriptivos y salen de lo que se ve en cada fotografía.
 */

export type CategoryId = "tops" | "pantalones" | "noche" | "vestidos";

export type Category = {
  id: CategoryId;
  label: string;
  /** Foto de portada; null si todavía no hay fotografía real. */
  image: { src: string; alt: string; position?: string } | null;
};

export type Product = {
  id: string;
  name: string;
  category: Exclude<CategoryId, "vestidos">;
  /** Precio en pesos argentinos. null = «Precio a consultar». */
  price: number | null;
  sizes?: string[];
  description?: string;
  image: { src: string; alt: string; width: number; height: number; position?: string };
};

export const categories: Category[] = [
  {
    id: "tops",
    label: "Tops",
    image: {
      src: "/images/products/script-crema.webp",
      alt: "Remera oversize crema con estampa en caligrafía negra y detalles en las mangas",
    },
  },
  {
    id: "pantalones",
    label: "Pantalones",
    image: {
      src: "/images/products/flare-frente.webp",
      alt: "Modelo con jean flare de lavado claro y remera negra",
      position: "50% 70%",
    },
  },
  {
    id: "vestidos",
    label: "Vestidos",
    image: null,
  },
  {
    id: "noche",
    label: "Noche",
    image: {
      src: "/images/products/encaje-tiras.webp",
      alt: "Tres tops de encaje con tiras en negro, blanco y marrón",
    },
  },
];

export const products: Product[] = [
  {
    id: "remera-cruz-negra",
    name: "Remera oversize negra con cruz",
    category: "tops",
    price: null,
    image: {
      src: "/images/products/cruz-negra.webp",
      alt: "Remera oversize negra con una gran cruz gráfica en blanco",
      width: 1500,
      height: 1500,
    },
  },
  {
    id: "remera-script-crema",
    name: "Remera oversize crema con caligrafía",
    category: "tops",
    price: null,
    image: {
      src: "/images/products/script-crema.webp",
      alt: "Remera oversize crema con estampa en caligrafía negra y detalles en las mangas",
      width: 1500,
      height: 1500,
    },
  },
  {
    id: "remera-script-marron",
    name: "Remera oversize marrón con caligrafía",
    category: "tops",
    price: null,
    image: {
      src: "/images/products/script-marron.webp",
      alt: "Remera oversize marrón con estampa en caligrafía blanca",
      width: 1500,
      height: 1500,
    },
  },
  {
    id: "jean-baggy-negro",
    name: "Jean baggy negro con estampa rosa",
    category: "pantalones",
    price: null,
    image: {
      src: "/images/products/negro-rosa.webp",
      alt: "Jean baggy negro desteñido con estampa rosa en el bolsillo trasero",
      width: 1024,
      height: 1280,
    },
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
    },
  },
  {
    id: "tops-encaje-tiras",
    name: "Tops de encaje con tiras",
    category: "noche",
    price: null,
    image: {
      src: "/images/products/encaje-tiras.webp",
      alt: "Tres tops de encaje con tiras en negro, blanco y marrón",
      width: 960,
      height: 1280,
    },
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
    },
  },
];

/** Fotografías reales que se usan como apoyo editorial (hero y sección de marca). */
export const editorial = {
  hero: {
    src: "/images/products/cadena-cruces.webp",
    alt: "Remera oversize negra con dos cruces unidas por una cadena, estampadas en blanco",
    width: 1500,
    height: 1500,
  },
  heroSecondary: {
    src: "/images/products/flare-espalda.webp",
    alt: "Modelo de espaldas con jean flare de lavado claro",
    width: 543,
    height: 724,
  },
  brandMain: {
    src: "/images/products/negro-rosa-espalda.webp",
    alt: "Jean negro desteñido con estampa rosa en la cintura y el bolsillo trasero",
    width: 1024,
    height: 1280,
  },
  contact: {
    src: "/images/products/baggy-claro.webp",
    alt: "Modelo con jean baggy de lavado claro y bordado en la pierna, remera blanca",
    width: 928,
    height: 811,
  },
  brandSecondary: {
    src: "/images/products/bermuda.webp",
    alt: "Modelo con bermuda de jean con brillos y remera azul oscura",
    width: 771,
    height: 1000,
  },
};

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number | null) {
  return price === null ? "Precio a consultar" : priceFormatter.format(price);
}
