import Image from "next/image";
import { ArrowDown, MessageCircle } from "lucide-react";
import { editorial } from "@/data/products";
import { address } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { AnchorLink } from "./AnchorLink";
import { Star } from "./Star";

const lines = ["Una prenda,", "mil maneras."];

export function Hero() {
  return (
    <section id="inicio" className="relative bg-paper pt-[var(--header-h)]">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-5 pb-14 pt-8 md:px-10 lg:min-h-[calc(100dvh-var(--header-h))] lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-16 lg:pt-6">
        <div className="lg:col-span-7">
          <h1 className="display text-[clamp(2.75rem,7.4vw,6.6rem)]">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="rise" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="fade-up mt-6 max-w-md text-base leading-relaxed text-graphite md:mt-8 md:text-lg" style={{ animationDelay: "520ms" }}>
            Ropa urbana unisex en Puerto Iguazú. Tops, pantalones, vestidos y prendas para salir de noche, con variedad y calidad para cada ocasión.
          </p>

          <div className="fade-up mt-7 flex flex-col gap-3 sm:flex-row md:mt-9" style={{ animationDelay: "640ms" }}>
            <AnchorLink
              href="#coleccion"
              className="press group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-ink md:h-14 px-8 text-base font-medium text-white hover:bg-graphite"
            >
              Explorar colección
              <ArrowDown
                size={18}
                aria-hidden
                className="transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-y-0.5"
              />
            </AnchorLink>
            <a
              href={whatsappUrl(generalMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-line px-8 text-base font-medium text-ink hover:bg-ink hover:text-white md:h-14"
            >
              <MessageCircle size={18} aria-hidden />
              Contactar por WhatsApp
            </a>
          </div>

          <p className="fade-up mt-10 hidden text-sm text-graphite lg:block" style={{ animationDelay: "760ms" }}>
            Local en {address.street}, {address.city.split(",")[0]}.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden bg-line">
            <Image
              src={editorial.hero.src}
              alt={editorial.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="settle object-cover"
            />
          </div>

          <Star className="star-spin absolute -left-8 bottom-16 z-10 size-20 md:-left-12 md:size-28 lg:-left-14 lg:size-32" />

          <div className="absolute -bottom-6 -right-2 w-[34%] border-[6px] border-paper md:-right-6">
            <Image
              src={editorial.heroSecondary.src}
              alt={editorial.heroSecondary.alt}
              width={editorial.heroSecondary.width}
              height={editorial.heroSecondary.height}
              sizes="(min-width: 1024px) 14vw, 30vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
