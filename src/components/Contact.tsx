import { address, payments, phones, social } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { Reveal } from "./Reveal";

const row = "grid gap-2 border-b border-line py-5 md:grid-cols-[14rem_1fr] md:gap-8";
const link = "t-label inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline";

/** Contacto como tabla editorial: una fila por dato, rótulo a la izquierda, sin cajas ni tarjetas. */
export function Contact() {
  return (
    <section id="contacto" data-nav="contacto" aria-labelledby="contacto-titulo" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Reveal>
          <h2 id="contacto-titulo" className="t-display text-[clamp(3.5rem,11vw,10rem)]">
            Contacto
          </h2>
        </Reveal>

        <Reveal as="dl" className="mt-8 border-t border-ink md:mt-12">
          <div className={row}>
            <dt className="t-label tag text-mid">Local</dt>
            <dd>
              <address className="text-lg not-italic leading-snug">
                {address.street}
                <br />
                <span className="text-graphite">
                  {address.between}. {address.city}
                </span>
              </address>
              <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Cómo llegar<span className="sr-only"> (se abre en Google Maps)</span>
              </a>
            </dd>
          </div>

          <div className={row}>
            <dt className="t-label tag text-mid">WhatsApp</dt>
            <dd>
              <ul>
                {phones.map((p) => (
                  <li key={p.tel} className="flex flex-wrap items-center gap-x-6">
                    <span className="t-title text-3xl">{p.display}</span>
                    <a href={whatsappUrl(generalMessage, p)} target="_blank" rel="noopener noreferrer" className={link}>
                      Escribir<span className="sr-only"> al {p.display} por WhatsApp (se abre en una pestaña nueva)</span>
                    </a>
                    <a href={`tel:${p.tel}`} className={link}>
                      Llamar<span className="sr-only"> al {p.display}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div className={row}>
            <dt className="t-label tag text-mid">Redes</dt>
            <dd>
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className={link}>
                Instagram {social.instagram.handle}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              {social.facebook && (
                <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" className={`${link} ml-6`}>
                  Facebook {social.facebook.handle}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              )}
            </dd>
          </div>

          <div className={row}>
            <dt className="t-label tag text-mid">Pagos</dt>
            <dd className="text-sm leading-relaxed text-graphite">{payments.map((m) => m.label).join(" · ")}</dd>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
