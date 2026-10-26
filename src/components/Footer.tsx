import Image from "next/image";
import { address, nav, payments, phones, social } from "@/data/site";
import { InstagramIcon, FacebookIcon } from "./icons";
import { AnchorLink } from "./AnchorLink";

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="mx-auto grid max-w-[1480px] gap-12 px-5 py-16 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Image src="/brand/logo-light.png" alt="ICONIC" width={900} height={363} className="h-12 w-auto" />
          <p className="mt-5 max-w-xs text-white/80">Ropa urbana unisex para adultos en Puerto Iguazú.</p>
        </div>

        <nav aria-label="Pie de página" className="lg:col-span-2">
          <h2 className="text-base font-semibold text-white/70">Navegación</h2>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <AnchorLink href={item.href} className="inline-block py-1 hover:underline">
                  {item.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-base font-semibold text-white/70">Local y contacto</h2>
          <address className="mt-4 space-y-3 not-italic text-white/90">
            <p>
              {address.street}
              <br />
              <span className="text-white/70">{address.city}</span>
            </p>
            <p>
              {phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="block py-0.5 hover:underline">
                  {p.display}
                </a>
              ))}
            </p>
          </address>
          <ul className="mt-5 flex gap-2">
            <li>
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de ICONIC (se abre en una pestaña nueva)"
                className="press inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-ink"
              >
                <InstagramIcon />
              </a>
            </li>
            {social.facebook && (
              <li>
                <a
                  href={social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de ICONIC (se abre en una pestaña nueva)"
                  className="press inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-ink"
                >
                  <FacebookIcon />
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-base font-semibold text-white/70">Medios de pago</h2>
          <ul className="mt-4 space-y-1 text-white/90">
            {payments.map((m) => (
              <li key={m.id}>{m.label}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="mx-auto max-w-[1480px] px-5 py-6 text-sm text-white/70 md:px-10">
          © ICONIC. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
