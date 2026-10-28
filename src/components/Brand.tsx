"use client";

import { ImageAccordion } from "./ImageAccordion";
import { Reveal } from "./Reveal";

const values = [
  { title: "Versatilidad", text: "Prendas para combinar, cambiar de plan y repetir con otro look." },
  { title: "Calidad", text: "Una selección pensada para que cada prenda se sienta bien y dure." },
  { title: "Variedad", text: "Tops, pantalones, vestidos y ropa de noche, unisex, en un solo lugar." },
];

export function Brand() {
  return (
    <section
      id="marca"
      data-nav="marca"
      data-dark
      aria-labelledby="marca-titulo"
      className="on-dark bg-ink py-20 text-white md:py-32"
    >
      <div className="mx-auto grid max-w-[1480px] gap-16 px-5 md:px-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <Reveal>
            <h2 id="marca-titulo" className="display h2-display">
              Para cada
              <br />
              ocasión
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-xl leading-relaxed text-white/90 md:text-2xl">
              ICONIC es ropa urbana unisex para adultos, con una experiencia de compra simple y cercana: pasás por el
              local o nos escribís por WhatsApp.
            </p>
          </Reveal>

          <ul className="mt-12 space-y-2">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={0.05 * i} className="grid gap-1 bg-white/5 p-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <h3 className="display text-xl">{v.title}</h3>
                <p className="text-white/80">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[34rem] lg:col-span-6 lg:max-w-none lg:pl-10">
          <Reveal delay={0.1}>
            <ImageAccordion width="100%" height="clamp(22rem, 68svh, 36rem)" bounce={0} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
