import Image from "next/image";
import { editorial } from "@/data/products";
import { site } from "@/data/site";
import { AnchorLink } from "./AnchorLink";

/**
 * Portada editorial: titular condensado a todo el ancho y dos fotografías reales de prendas
 * en alturas distintas. El CTA es uno solo, discreto y rectangular. Entra con CSS puro para verse al instante.
 */
export function Hero() {
  return (
    <section id="inicio" data-nav="inicio" aria-labelledby="hero-titulo" className="pt-[var(--header-h)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-6 md:px-8 md:pb-24 md:pt-8">
        <p className="t-label flex justify-between text-graphite">
          <span>{site.name}</span>
          <span>Puerto Iguazú, Misiones</span>
        </p>

        <h1
          id="hero-titulo"
          className="t-display mt-4 overflow-hidden text-[clamp(4rem,14vw,14rem)] leading-[0.84]"
        >
          <span className="rise block">Ropa urbana</span>
          <span className="rise block [animation-delay:90ms]">unisex</span>
        </h1>

        <div className="fade-up mt-8 grid gap-x-4 gap-y-6 [animation-delay:350ms] md:mt-12 md:grid-cols-12">
          <div className="flex flex-col justify-between gap-6 md:col-span-3 md:row-span-1">
            <p className="max-w-[24ch] text-sm leading-relaxed text-graphite">
              Tops, pantalones, vestidos y ropa de noche para adultos. En el local o por WhatsApp.
            </p>
            <AnchorLink href="#coleccion" className="btn w-fit">
              Ver colección
            </AnchorLink>
          </div>

          <div className="md:col-span-5 md:col-start-5">
            <Image
              src={editorial.heroMain.src}
              alt={editorial.heroMain.alt}
              width={editorial.heroMain.width}
              height={editorial.heroMain.height}
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-auto w-full bg-paper"
            />
          </div>

          <div className="md:col-span-3 md:col-start-10 md:mt-24">
            <Image
              src={editorial.heroSecond.src}
              alt={editorial.heroSecond.alt}
              width={editorial.heroSecond.width}
              height={editorial.heroSecond.height}
              priority
              sizes="(min-width: 768px) 24vw, 70vw"
              className="h-auto w-3/4 bg-paper md:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
