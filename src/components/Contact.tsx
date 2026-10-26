import Image from "next/image";
import { editorial } from "@/data/products";
import { Banknote, CreditCard, Landmark, MapPin, MessageCircle, Phone, QrCode } from "lucide-react";
import { address, payments, phones, social, type PaymentId } from "@/data/site";
import { whatsappUrl, generalMessage } from "@/lib/whatsapp";
import { FacebookIcon, InstagramIcon } from "./icons";
import { Reveal } from "./Reveal";

const paymentIcons: Record<PaymentId, typeof Banknote> = {
  efectivo: Banknote,
  debito: CreditCard,
  credito: CreditCard,
  qr: QrCode,
  transferencia: Landmark,
};

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-[1480px] px-5 md:px-10">
        <Reveal>
          <h2 id="contacto-titulo" className="display h2-display">
            Pasá por el local
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
            Te esperamos en {address.street} para que veas y te pruebes las prendas. Si preferís, escribinos por
            WhatsApp.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <MapPin size={18} aria-hidden /> Dirección
            </h3>
            <address className="mt-4 text-xl not-italic leading-snug">
              <strong className="font-semibold">{address.street}</strong>
              <br />
              <span className="text-graphite">{address.between}</span>
              <br />
              <span className="text-graphite">{address.city}</span>
            </address>
            <a
              href={address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="press mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-line px-6 text-sm font-medium text-ink hover:bg-ink hover:text-white"
            >
              Cómo llegar
              <span className="sr-only"> (se abre en Google Maps)</span>
            </a>
            <Image
              src={editorial.contact.src}
              alt={editorial.contact.alt}
              width={editorial.contact.width}
              height={editorial.contact.height}
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="mt-10 hidden h-auto w-full max-w-lg lg:block"
            />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <h3 className="sr-only">Teléfonos y WhatsApp</h3>
            <ul className="mt-4 space-y-2">
              {phones.map((p) => (
                <li key={p.tel} className="flex flex-col gap-3 bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="display text-3xl md:text-4xl">{p.display}</span>
                  <span className="flex gap-2">
                    <a
                      href={whatsappUrl(generalMessage, p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white hover:bg-graphite sm:flex-none"
                    >
                      <MessageCircle size={18} aria-hidden />
                      WhatsApp
                      <span className="sr-only"> al {p.display}</span>
                    </a>
                    <a
                      href={`tel:${p.tel}`}
                      className="press inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-line px-6 text-sm font-medium text-ink hover:bg-ink hover:text-white sm:flex-none"
                    >
                      <Phone size={18} aria-hidden />
                      Llamar
                      <span className="sr-only"> al {p.display}</span>
                    </a>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-base font-semibold">Redes</h3>
                <ul className="mt-4 flex flex-col gap-2">
                  <li>
                    <a
                      href={social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press inline-flex h-12 items-center gap-3 rounded-full bg-paper px-5 text-sm font-medium hover:bg-line"
                    >
                      <InstagramIcon /> {social.instagram.handle}
                      <span className="sr-only"> en Instagram (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                  {social.facebook && (
                    <li>
                      <a
                        href={social.facebook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press inline-flex h-12 items-center gap-3 rounded-full bg-paper px-5 text-sm font-medium hover:bg-line"
                      >
                        <FacebookIcon /> {social.facebook.handle}
                        <span className="sr-only"> en Facebook (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Medios de pago</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {payments.map((m) => {
                    const Icon = paymentIcons[m.id];
                    return (
                      <li
                        key={m.id}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm"
                      >
                        <Icon size={16} aria-hidden /> {m.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
