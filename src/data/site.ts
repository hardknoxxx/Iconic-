/**
 * Configuración comercial de ICONIC.
 * Todo dato de contacto vive acá: editá este archivo y la web completa se actualiza.
 */

export const site = {
  name: "ICONIC",
  tagline: "Ropa urbana unisex para adultos",
  description:
    "ICONIC es una tienda de ropa urbana unisex en Puerto Iguazú, Misiones: tops, pantalones, vestidos y prendas para salir de noche. Consultá por WhatsApp o visitá el local.",
  url: "https://iconic-hardknoxxx.vercel.app", // TODO: cambiar por el dominio propio cuando exista
  locale: "es_AR",
} as const;

export type Phone = {
  /** Como se muestra en pantalla. */
  display: string;
  /** Formato internacional para wa.me (sin "+", con el 9 de móviles argentinos). */
  whatsapp: string;
  /** Formato internacional para tel: */
  tel: string;
};

/** El primer teléfono es el canal principal de consultas por producto. */
export const phones: Phone[] = [
  { display: "3757-548713", whatsapp: "5493757548713", tel: "+543757548713" },
  { display: "3757-361654", whatsapp: "5493757361654", tel: "+543757361654" },
];

export const primaryPhone = phones[0];

export const social = {
  instagram: {
    handle: "@iconic.pi",
    url: "https://www.instagram.com/iconic.pi?rpxt=MW1oM3I4eWxoMzl1NA==",
  },
  /** Sin URL provista todavía: al completarla, el botón aparece solo. */
  facebook: null as null | { handle: string; url: string },
};

export const address = {
  street: "Guatambú 15",
  between: "entre Avenida República Argentina y Los Cedros",
  city: "Puerto Iguazú, Misiones, Argentina",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Guatambú 15, Puerto Iguazú, Misiones, Argentina"),
};

export const payments = [
  { id: "efectivo", label: "Efectivo" },
  { id: "debito", label: "Tarjeta de débito" },
  { id: "credito", label: "Tarjeta de crédito" },
  { id: "qr", label: "QR" },
  { id: "transferencia", label: "Transferencia bancaria" },
] as const;

export type PaymentId = (typeof payments)[number]["id"];

export const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#coleccion", label: "Colección" },
  { href: "#marca", label: "La marca" },
  { href: "#contacto", label: "Contacto" },
] as const;
