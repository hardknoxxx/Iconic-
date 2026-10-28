import { primaryPhone, type Phone } from "@/data/site";

/** Construye un enlace wa.me con el texto precompletado y correctamente codificado. */
export function whatsappUrl(message: string, phone: Phone = primaryPhone) {
  return `https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const generalMessage =
  "Hola, ICONIC. Quiero hacer una consulta sobre sus prendas.";

export function productMessage(name: string) {
  return `Hola, ICONIC. Quiero consultar por ${name}. ¿Me podrían informar la disponibilidad y los talles?`;
}

export function categoryMessage(label: string) {
  return `Hola, ICONIC. Quiero consultar por ${label.toLowerCase()}. ¿Qué tienen disponible?`;
}

/** Mensaje con todo lo que hay en el carrito, para abrir el chat de WhatsApp ya escrito. */
export function cartMessage(lines: { name: string; qty: number }[]) {
  const items = lines.map((l) => `- ${l.qty} x ${l.name}`).join("\n");
  return `Hola, ICONIC. Quiero consultar por estas prendas:\n${items}\n¿Me podrían informar la disponibilidad y los talles?`;
}
