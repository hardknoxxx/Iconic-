import Image from "next/image";
import { lookbook } from "@/data/products";

/**
 * Lookbook horizontal: la sección se fija y el scroll vertical arrastra las fotos hacia la izquierda,
 * cada una a su propia velocidad (data-lag), de modo que se superponen y se separan como capas.
 * Sin JavaScript o con movimiento reducido es una tira que se desliza con el dedo.
 */
export function Lookbook() {
  return (
    <section
      id="lookbook"
      data-hscroll
      aria-labelledby="lookbook-titulo"
      className="flex h-svh flex-col justify-center overflow-x-auto border-t border-ink bg-white pt-[var(--header-h)]"
    >
      <div data-track className="flex w-max items-center gap-[4vw] px-4 md:px-8">
        <div className="w-[min(78vw,34rem)] shrink-0">
          <p className="t-label tag text-mid">Lookbook</p>
          <h2 id="lookbook-titulo" className="t-display mt-3 text-[clamp(3.5rem,10vw,9rem)]">
            Look
            <br />
            book
          </h2>
        </div>

        {lookbook.map((photo, i) => (
          <figure
            key={photo.src}
            data-lag={photo.lag}
            className="shrink-0"
            style={{ position: "relative", top: `${photo.lift - 9}vh` }}
          >
            <div
              className="relative bg-paper"
              style={{ height: `${photo.size}svh`, aspectRatio: `${photo.width} / ${photo.height}` }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 40vw, 70vw"
                className="object-cover"
              />
            </div>
            <figcaption className="t-label tag mt-2 text-mid">{String(i + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
