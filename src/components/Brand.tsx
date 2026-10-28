"use client";

import { ImageAccordion } from "./ImageAccordion";
import { Reveal } from "./Reveal";

const values = [
  { title: "Versatilidad", text: "Prendas para combinar y repetir con otro look." },
  { title: "Calidad", text: "Prendas elegidas para que se sientan bien y duren." },
  { title: "Variedad", text: "Tops, pantalones, vestidos y ropa de noche, todo unisex." },
];

export function Brand() {
  return (
    <section
      id="marca"
      data-nav="marca"
      aria-labelledby="marca-titulo"
      className="on-dark bg-ink py-16 text-white md:py-24"
    >
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="t-label tag text-mid">La marca</p>
            <h2 id="marca-titulo" data-title className="t-display mt-3 text-[clamp(3.5rem,9vw,8.5rem)] leading-[1.05]">
              Para cada
              <br />
              ocasión
            </h2>
            <p className="t-lead mt-8 max-w-[26ch] text-white">
              ICONIC es ropa urbana unisex para adultos. Podés pasar por el local o escribirnos por WhatsApp.
            </p>
          </Reveal>

          <ul className="mt-12 border-t border-white/30">
            {values.map((v, i) => (
              <Reveal
                as="li"
                key={v.title}
                delay={0.05 * i}
                className="grid gap-1 border-b border-white/30 py-4 sm:grid-cols-[3rem_11rem_1fr] sm:gap-4"
              >
                <span className="t-label tag text-mid">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-title text-2xl">{v.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="w-full lg:col-span-6 lg:pl-8">
          <Reveal delay={0.1}>
            <ImageAccordion width="100%" height="clamp(22rem, 68svh, 38rem)" bounce={0} gap={2} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
