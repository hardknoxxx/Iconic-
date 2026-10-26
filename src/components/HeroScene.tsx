"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { address } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { blobShapes } from "@/lib/blob";
import { AnchorLink } from "./AnchorLink";

gsap.registerPlugin(useGSAP, ScrollTrigger, MorphSVGPlugin);

/**
 * Portada y escena de scroll en una sola pieza (sección fijada con ScrollTrigger):
 * 1. El campo de color se retira hasta quedar como una mancha sobre fondo claro mientras las prendas crecen.
 * 2. Tres escenas («De día», «De calle», «De noche»): la mancha se deforma, cambia de lugar y
 *    cada grupo de prendas entra por un lado con su tarjeta por el otro.
 * 3. La mancha vuelve a cubrir todo y aparece el cierre con los botones.
 * Sin animación (movimiento reducido) se muestra la versión estática de abajo.
 */

type Piece = { src: string; w: number; h: number; alt: string; cls: string; rot: number };

const cutout = (name: string, w: number, h: number, alt: string, cls: string, rot: number): Piece => ({
  src: `/images/cutouts/${name}.webp`,
  w,
  h,
  alt,
  cls,
  rot,
});

const groups = {
  a: [
    cutout("crema", 820, 662, "Remera oversize crema con estampa en caligrafía negra", "left-[0%] bottom-[14%] w-[36%] z-10", -8),
    cutout("cadena", 820, 657, "Remera oversize negra con dos cruces unidas por una cadena", "left-[29%] bottom-[0%] w-[43%] z-30", 3),
    cutout("marron", 820, 649, "Remera oversize marrón con estampa en caligrafía blanca", "left-[64%] bottom-[16%] w-[36%] z-20", 9),
  ],
  b: [
    cutout("jeans-rosa", 783, 719, "Jean baggy negro desteñido con estampa rosa", "left-[6%] top-[4%] w-[52%] z-20", -3),
    cutout("jeans-liso", 669, 719, "Jean baggy negro desteñido", "left-[48%] top-[30%] w-[44%] z-10", 8),
    cutout("corazon", 820, 672, "Remera oversize negra con un corazón de espinas", "left-[0%] top-[50%] w-[40%] z-30", -9),
  ],
  c: [
    cutout("encaje-tiras", 618, 953, "Tops de encaje con tiras en negro, blanco y marrón", "left-[12%] top-[2%] w-[36%] z-10", -5),
    cutout("encaje-tubo", 654, 970, "Tops de encaje tipo tubo en negro, blanco y marrón", "left-[50%] top-[14%] w-[38%] z-20", 6),
  ],
};

const cards = [
  { key: "dia", title: "De día", text: "Remeras oversize y estampas que van con todo lo que tengas." },
  { key: "calle", title: "De calle", text: "Jeans baggy, flare y bermudas para el día a día." },
  { key: "noche", title: "De noche", text: "Tops de encaje y prendas para salir de noche." },
];

function PieceImg({ p, sizes }: { p: Piece; sizes: string }) {
  return (
    <div className={`absolute ${p.cls}`} style={{ transform: `rotate(${p.rot}deg)` }}>
      <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes={sizes} className="h-auto w-full select-none" draggable={false} />
    </div>
  );
}

const ctaPrimary =
  "press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-8 text-base font-medium text-white hover:bg-graphite md:h-14";
const ctaSecondary =
  "press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-medium text-ink hover:bg-ink hover:text-white md:h-14";

/** Valores de movimiento por tamaño de pantalla (unidades vw/vh de GSAP). */
const configs = {
  desktop: {
    heroScale: 1.5,
    scenes: [
      { scale: 0.95, x: "10vw", y: "2vh", rotation: 20 },
      { scale: 0.9, x: "-12vw", y: "-4vh", rotation: 55 },
      { scale: 0.9, x: "12vw", y: "4vh", rotation: 95 },
    ],
    end: { scale: 1.55, x: "0vw", y: "0vh", rotation: 140 },
    aDay: { x: "-21vw", y: "-8vh", scale: 1.2 },
    aOut: { x: "-110vw" },
    inB: "80vw",
    outB: "-120vw",
    inC: "-80vw",
    outC: "110vw",
    cardIn: ["45vw", "-45vw", "45vw"],
    cardOut: ["-20vw", "20vw", "-20vw"],
  },
  mobile: {
    heroScale: 1.9,
    scenes: [
      { scale: 1.0, x: "0vw", y: "-8vh", rotation: 20 },
      { scale: 1.0, x: "-8vw", y: "6vh", rotation: 55 },
      { scale: 1.0, x: "8vw", y: "-4vh", rotation: 95 },
    ],
    end: { scale: 2.0, x: "0vw", y: "0vh", rotation: 140 },
    aDay: { x: "0vw", y: "-33vh", scale: 1.1 },
    aOut: { x: "-110vw" },
    inB: "110vw",
    outB: "-110vw",
    inC: "-110vw",
    outC: "110vw",
    cardIn: ["0vw", "0vw", "0vw"],
    cardOut: ["0vw", "0vw", "0vw"],
  },
};

function Scene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          if (reduce) return;
          const c = desktop ? configs.desktop : configs.mobile;
          const q = gsap.utils.selector(root);

          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + window.innerHeight * 5.5,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Estado inicial: campo de color cubriendo todo, sin escenas visibles.
          gsap.set(q(".blob"), { scale: c.heroScale, transformOrigin: "50% 50%" });
          gsap.set([q(".grp-b"), q(".grp-c")], { x: c.inB, autoAlpha: 1 });
          gsap.set(q(".grp-c"), { x: c.inC });
          gsap.set(q(".card"), { autoAlpha: 0 });
          gsap.set(q(".final"), { autoAlpha: 0, y: 40 });

          // 1 — portada → «De día»
          tl.to(q(".hero-text"), { autoAlpha: 0, y: -70, scale: 1.05, duration: 0.7 }, 0)
            .to(q(".blob"), { ...c.scenes[0], duration: 1.3 }, 0.1)
            .to(q(".blob-path"), { morphSVG: blobShapes.dia, duration: 1.3, ease: "none" }, 0.1)
            .to(q(".grp-a"), { ...c.aDay, duration: 1.3 }, 0.1)
            .fromTo(q(".card-0"), { x: c.cardIn[0], autoAlpha: 0 }, { x: "0vw", autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 0.9);

          // 2 — «De día» → «De calle»
          tl.to(q(".card-0"), { x: c.cardOut[0], autoAlpha: 0, duration: 0.5 }, 2.0)
            .to(q(".grp-a"), { x: c.aOut.x, autoAlpha: 0, duration: 1.0 }, 2.0)
            .to(q(".blob"), { ...c.scenes[1], duration: 1.3 }, 2.0)
            .to(q(".blob-path"), { morphSVG: blobShapes.calle, duration: 1.3, ease: "none" }, 2.0)
            .to(q(".grp-b"), { x: "0vw", duration: 1.1, ease: "power3.out" }, 2.2)
            .fromTo(q(".card-1"), { x: c.cardIn[1], autoAlpha: 0 }, { x: "0vw", autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 3.0);

          // 3 — «De calle» → «De noche»
          tl.to(q(".card-1"), { x: c.cardOut[1], autoAlpha: 0, duration: 0.5 }, 4.0)
            .to(q(".grp-b"), { x: c.outB, autoAlpha: 0, duration: 1.0 }, 4.0)
            .to(q(".blob"), { ...c.scenes[2], duration: 1.3 }, 4.0)
            .to(q(".blob-path"), { morphSVG: blobShapes.noche, duration: 1.3, ease: "none" }, 4.0)
            .to(q(".grp-c"), { x: "0vw", duration: 1.1, ease: "power3.out" }, 4.2)
            .fromTo(q(".card-2"), { x: c.cardIn[2], autoAlpha: 0 }, { x: "0vw", autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 5.0);

          // 4 — «De noche» → cierre
          tl.to(q(".card-2"), { x: c.cardOut[2], autoAlpha: 0, duration: 0.5 }, 6.0)
            .to(q(".grp-c"), { x: c.outC, autoAlpha: 0, duration: 1.0 }, 6.0)
            .to(q(".blob"), { ...c.end, duration: 1.2 }, 6.0)
            .to(q(".blob-path"), { morphSVG: blobShapes.cover, duration: 1.2, ease: "none" }, 6.0)
            .to(q(".final"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 6.9)
            .to({}, { duration: 0.6 }, 7.6);

          // La estrella del logo gira durante todo el recorrido.
          tl.to(q(".star"), { rotation: 540, duration: tl.duration(), ease: "none" }, 0);
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="inicio" ref={root} className="relative bg-paper">
      <div className="relative h-svh overflow-hidden">
        {/* Mancha de color: al principio cubre toda la pantalla y se retira hasta quedar como forma. */}
        <svg
          viewBox="-520 -520 1040 1040"
          aria-hidden
          className="blob pointer-events-none absolute left-1/2 top-1/2 -ml-[50vmax] -mt-[50vmax] h-[100vmax] w-[100vmax]"
          style={{ transform: "scale(1.6)" }}
        >
          <path className="blob-path" d={blobShapes.cover} fill="var(--color-accent)" />
        </svg>

        {/* Estrella del logo */}
        <svg viewBox="0 0 100 100" aria-hidden className="star pointer-events-none absolute right-[7vw] top-[53vh] z-10 size-12 md:right-[7vw] md:top-[18vh] md:size-28">
          <path d="M50 0C53 31 69 47 100 50C69 53 53 69 50 100C47 69 31 53 0 50C31 47 47 31 50 0Z" fill="#111111" />
        </svg>

        {/* Prendas */}
        <div className="grp-a absolute bottom-[-3vh] left-[6vw] z-10 h-[40vh] w-[88vw] md:bottom-[-5vh] md:left-[19vw] md:h-[52vh] md:w-[62vw]">
          {groups.a.map((p) => (
            <PieceImg key={p.src} p={p} sizes="(min-width: 768px) 26vw, 40vw" />
          ))}
        </div>
        <div className="grp-b absolute left-[6vw] top-[14vh] z-10 h-[50vh] w-[88vw] opacity-0 md:left-[40vw] md:top-[12vh] md:h-[76vh] md:w-[52vw]" style={{ visibility: "hidden" }}>
          {groups.b.map((p) => (
            <PieceImg key={p.src} p={p} sizes="(min-width: 768px) 26vw, 45vw" />
          ))}
        </div>
        <div className="grp-c absolute left-[6vw] top-[10vh] z-10 h-[56vh] w-[88vw] opacity-0 md:left-[8vw] md:top-[6vh] md:h-[86vh] md:w-[52vw]" style={{ visibility: "hidden" }}>
          {groups.c.map((p) => (
            <PieceImg key={p.src} p={p} sizes="(min-width: 768px) 20vw, 40vw" />
          ))}
        </div>

        {/* Portada */}
        <div className="hero-text absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] z-20 px-5 text-center md:top-[17vh]">
          <h1 className="display display-xl mx-auto text-[clamp(2.9rem,9vw,8.5rem)]">
            Una prenda,
            <br />
            mil maneras.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink md:mt-7 md:text-xl">
            Ropa urbana unisex en Puerto Iguazú: tops, pantalones, vestidos y prendas para salir de noche.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-8">
            <AnchorLink href="#coleccion" className={ctaPrimary}>
              Explorar colección
            </AnchorLink>
            <a href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer" className={ctaSecondary}>
              <MessageCircle size={18} aria-hidden />
              Contactar por WhatsApp
            </a>
          </div>
        </div>

        {/* Tarjetas de cada escena */}
        {cards.map((card, i) => (
          <article
            key={card.key}
            className={`card card-${i} absolute inset-x-4 bottom-5 z-20 bg-white p-5 md:inset-x-auto md:bottom-auto md:top-[calc(50%-6rem)] md:w-[23rem] md:p-7 ${
              i === 1 ? "md:left-[7vw]" : "md:right-[7vw]"
            }`}
            style={{ visibility: "hidden" }}
          >
            <h2 className="display text-3xl md:text-4xl">{card.title}</h2>
            <p className="mt-2 text-base leading-relaxed text-graphite">{card.text}</p>
            <AnchorLink href="#coleccion" className="press mt-4 inline-flex h-11 items-center rounded-full bg-paper px-5 text-sm font-medium hover:bg-line">
              Ver la colección
            </AnchorLink>
          </article>
        ))}

        {/* Cierre */}
        <div className="final absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-5 text-center" style={{ visibility: "hidden" }}>
          <h2 className="display display-xl mx-auto text-[clamp(2.6rem,8vw,7rem)]">
            Probátelo
            <br />
            en el local.
          </h2>
          <p className="mx-auto mt-5 text-lg text-ink">
            {address.street}, {address.city.split(",")[0]}.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AnchorLink href="#coleccion" className={ctaPrimary}>
              Ver la colección
            </AnchorLink>
            <a href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer" className={ctaSecondary}>
              <MessageCircle size={18} aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Con movimiento reducido: portada y los tres looks apilados, sin sección fijada. */
function StaticScene() {
  return (
    <section id="inicio" className="bg-accent pt-[calc(var(--header-h)+2rem)]">
      <div className="mx-auto max-w-[1480px] px-5 pb-16 md:px-10 md:pb-24">
        <h1 className="display display-xl text-[clamp(2.9rem,9vw,8.5rem)]">
          Una prenda,
          <br />
          mil maneras.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed">
          Ropa urbana unisex en Puerto Iguazú: tops, pantalones, vestidos y prendas para salir de noche.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AnchorLink href="#coleccion" className={ctaPrimary}>
            Explorar colección
          </AnchorLink>
          <a href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer" className={ctaSecondary}>
            <MessageCircle size={18} aria-hidden />
            Contactar por WhatsApp
          </a>
        </div>
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {([groups.a[1], groups.b[0], groups.c[0]] as Piece[]).map((p, i) => (
            <li key={p.src} className="bg-white p-5">
              <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 768px) 30vw, 90vw" className="h-64 w-full object-contain" />
              <h2 className="display mt-4 text-3xl">{cards[i].title}</h2>
              <p className="mt-1 text-graphite">{cards[i].text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HeroScene() {
  const reduce = useReducedMotion() === true;
  return reduce ? <StaticScene /> : <Scene />;
}
