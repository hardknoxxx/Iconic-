import { editorial } from "@/data/products";
import { address, site } from "@/data/site";
import { AnchorLink } from "./AnchorLink";
import { GlImage } from "./GlImage";

const link = "t-label inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline";

/**
 * Portada editorial. Titular a todo el ancho con la segunda línea corrida a la derecha y una fila de datos
 * entre filetes, como la de ARCR; dos fotos reales a distinta altura (con onda WebGL al pasar el cursor)
 * y pies de foto con enlace subrayado. Las dos líneas del titular se arrastran en sentidos opuestos con el scroll.
 * El CTA es uno solo. Entra con CSS puro para verse al instante.
 */
export function Hero() {
  return (
    <section id="inicio" data-nav="inicio" aria-labelledby="hero-titulo" className="pt-[var(--header-h)]">
      <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-6 md:px-8 md:pb-20 md:pt-8">
        <h1
          id="hero-titulo"
          className="t-display overflow-hidden text-[clamp(4rem,14vw,14rem)] leading-[0.84]"
        >
          {/* El arrastre va en un hijo: la entrada CSS (.rise) ya usa transform en el padre. */}
          <span className="rise block">
            <span className="block" data-drag="0,-6" data-drag-start="top top">
              Ropa urbana
            </span>
          </span>
          <span className="rise block pl-[12vw] [animation-delay:90ms] md:pl-[30vw]">
            <span className="block" data-drag="0,6" data-drag-start="top top">
              unisex
            </span>
          </span>
        </h1>

        <dl className="t-label fade-up mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-ink py-3 [animation-delay:250ms] md:grid-cols-4">
          <div>
            <dt className="sr-only">Qué es</dt>
            <dd>{site.tagline}</dd>
          </div>
          <div>
            <dt className="sr-only">Prendas</dt>
            <dd>Tops, pantalones, vestidos y noche</dd>
          </div>
          <div>
            <dt className="sr-only">Local</dt>
            <dd>{address.street}</dd>
          </div>
          <div className="md:text-right">
            <dt className="sr-only">Ciudad</dt>
            <dd>Puerto Iguazú, Misiones</dd>
          </div>
        </dl>

        <div className="fade-up mt-8 grid gap-x-4 gap-y-8 [animation-delay:350ms] md:mt-12 md:grid-cols-12">
          <div className="flex flex-col justify-between gap-6 md:col-span-3">
            <p className="t-lead max-w-[17ch]">
              Tops, pantalones, vestidos y ropa de noche para adultos. En el local o por WhatsApp.
            </p>
            <div className="flex flex-col items-start gap-2">
              <AnchorLink href="#coleccion" className="btn">
                Ver colección
              </AnchorLink>
              <p aria-hidden className="t-label mt-6 hidden text-mid md:block">
                Scroll ↓
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-5" data-parallax="3">
            <GlImage
              src={editorial.heroMain.src}
              alt={editorial.heroMain.alt}
              width={editorial.heroMain.width}
              height={editorial.heroMain.height}
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-auto w-full bg-paper"
            />
            <AnchorLink href="#cat-tops" className={link}>
              Ver tops
            </AnchorLink>
          </div>

          <div className="md:col-span-3 md:col-start-10 md:mt-24" data-parallax="8">
            <GlImage
              src={editorial.heroSecond.src}
              alt={editorial.heroSecond.alt}
              width={editorial.heroSecond.width}
              height={editorial.heroSecond.height}
              priority
              sizes="(min-width: 768px) 24vw, 70vw"
              className="h-auto w-3/4 bg-paper md:w-full"
            />
            <AnchorLink href="#cat-noche" className={link}>
              Ver noche
            </AnchorLink>
          </div>
        </div>
      </div>
    </section>
  );
}
