import Image from "next/image";
import { address, payments, phones, social } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { Reveal } from "./Reveal";

const link = "t-label link-grow tap inline-flex min-h-11 items-center";

/**
 * Contacto en cuatro columnas con foto, rótulo y datos, a la manera de las columnas de servicio de Deadly Ponies.
 * Todos los datos salen de src/data/site.ts. Las fotos son de la tienda y solo acompañan.
 */
export function Contact() {
  return (
    <section id="contacto" data-nav="contacto" aria-labelledby="contacto-titulo" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Reveal>
          <h2 id="contacto-titulo" data-title className="t-display text-[clamp(3.5rem,11vw,10rem)]">
            Contacto
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-x-3 gap-y-10 border-t border-ink pt-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          <Reveal as="li">
            <Tile n="01" title="Local" src="/images/products/mangas-largas.webp" alt="Prendas colgadas en una percha del local">
              <address className="text-base not-italic leading-snug">
                {address.street}
                <br />
                <span className="text-graphite">
                  {address.between}. {address.city}
                </span>
              </address>
              <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Cómo llegar<span className="sr-only"> (se abre en Google Maps)</span>
              </a>
            </Tile>
          </Reveal>

          <Reveal as="li" delay={0.06}>
            <Tile n="02" title="WhatsApp" src="/images/products/camuflado.webp" alt="Pantalón camuflado con bordados">
              <ul className="space-y-1">
                {phones.map((p) => (
                  <li key={p.tel}>
                    <span className="t-title text-3xl">{p.display}</span>
                    <span className="flex gap-4">
                      <a href={whatsappUrl(generalMessage, p)} target="_blank" rel="noopener noreferrer" className={link}>
                        Escribir<span className="sr-only"> al {p.display} por WhatsApp (se abre en una pestaña nueva)</span>
                      </a>
                      <a href={`tel:${p.tel}`} className={link}>
                        Llamar<span className="sr-only"> al {p.display}</span>
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </Tile>
          </Reveal>

          <Reveal as="li" delay={0.12}>
            <Tile n="03" title="Redes" src="/images/products/bermuda.webp" alt="Modelo con bermuda de jean con brillos">
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className={link}>
                Instagram {social.instagram.handle}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              {social.facebook && (
                <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" className={link}>
                  Facebook {social.facebook.handle}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              )}
            </Tile>
          </Reveal>

          <Reveal as="li" delay={0.18}>
            <Tile n="04" title="Pagos" src="/images/products/negro-liso.webp" alt="Jean baggy negro desteñido">
              <ul className="text-base leading-snug text-graphite">
                {payments.map((m) => (
                  <li key={m.id}>{m.label}</li>
                ))}
              </ul>
            </Tile>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

function Tile({
  n,
  title,
  src,
  alt,
  children,
}: {
  n: string;
  title: string;
  src: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 92vw" className="object-cover" />
      </div>
      <h3 className="t-label tag mt-3 text-mid">
        {n} · {title}
      </h3>
      <div className="mt-2 flex flex-col items-start gap-1">{children}</div>
    </article>
  );
}
