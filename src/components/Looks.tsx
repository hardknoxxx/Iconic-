"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useSyncExternalStore } from "react";

/**
 * «Una prenda, mil maneras»: escena fijada (sticky) cuyo avance lo manda el scroll.
 * Una forma orgánica con la foto de cada look se deforma y crece mientras el fondo pasa
 * de gris claro a negro y vuelve a blanco; tres tarjetas entran sobre la imagen y la estrella
 * del logo gira con el recorrido. Es la mecánica de la referencia, en la paleta de ICONIC.
 */

const looks = [
  {
    title: "De día",
    text: "Remeras oversize y estampas que van con todo lo que tengas.",
    image: {
      src: "/images/products/cadena-cruces.webp",
      alt: "Remera oversize negra con dos cruces unidas por una cadena, estampadas en blanco",
    },
  },
  {
    title: "De calle",
    text: "Jeans baggy, flare y bermudas para el día a día.",
    image: {
      src: "/images/products/negro-rosa-espalda.webp",
      alt: "Jean negro desteñido con estampa rosa en la cintura y el bolsillo trasero",
      position: "50% 72%",
      zoom: 1.22,
    },
  },
  {
    title: "De noche",
    text: "Tops de encaje y prendas para salir de noche.",
    image: {
      src: "/images/products/encaje-tiras.webp",
      alt: "Tres tops de encaje con tiras en negro, blanco y marrón",
    },
  },
];

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsWide = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true,
  );

/** Atajo: un valor que recorre `values` en los puntos de control del scroll. */
const STOPS = [0, 0.33, 0.66, 0.92, 1];
function useKeys(p: MotionValue<number>, values: number[]) {
  return useTransform(p, STOPS, values);
}

function Scene() {
  const ref = useRef<HTMLElement>(null);
  const wide = useIsWide();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Un resorte corto suaviza el avance sin quitarle respuesta.
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 });

  // Fondo: gris claro (como el hero) → negro → blanco (como la colección).
  const bg = useTransform(p, [0, 0.3, 0.5, 0.85, 1], ["#f7f7f7", "#e5e5e5", "#111111", "#111111", "#ffffff"]);

  // Recorte orgánico: caja que crece y radios que se deforman; al final queda un rectángulo suave.
  const top = useKeys(p, wide ? [14, 11, 10, 10, 10] : [20, 16, 13, 11, 11]);
  const side = useKeys(p, wide ? [27, 22, 26, 12, 12] : [10, 6, 8, 4, 4]);
  const r1 = useKeys(p, [58, 40, 62, 6, 6]);
  const r2 = useKeys(p, [42, 60, 38, 6, 6]);
  const r3 = useKeys(p, [55, 46, 60, 6, 6]);
  const r4 = useKeys(p, [45, 62, 40, 6, 6]);
  const r5 = useKeys(p, [45, 62, 40, 6, 6]);
  const r6 = useKeys(p, [60, 40, 56, 6, 6]);
  const r7 = useKeys(p, [40, 58, 44, 6, 6]);
  const r8 = useKeys(p, [55, 42, 60, 6, 6]);
  const clipPath = useMotionTemplate`inset(${top}% ${side}% ${top}% ${side}% round ${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%)`;

  // Foto de cada look: fundido cruzado y un leve acercamiento.
  const o1 = useTransform(p, [0, 0.3, 0.38], [1, 1, 0]);
  const o2 = useTransform(p, [0.3, 0.38, 0.6, 0.68], [0, 1, 1, 0]);
  const o3 = useTransform(p, [0.6, 0.68, 1], [0, 1, 1]);
  const zoom = useTransform(p, [0, 1], [1.12, 1]);
  const opacities = [o1, o2, o3];

  // Tarjetas: entran desde abajo y salen hacia arriba.
  const c1o = useTransform(p, [0.03, 0.11, 0.27, 0.35], [0, 1, 1, 0]);
  const c1y = useTransform(p, [0.03, 0.11, 0.27, 0.35], [28, 0, 0, -18]);
  const c2o = useTransform(p, [0.33, 0.41, 0.57, 0.65], [0, 1, 1, 0]);
  const c2y = useTransform(p, [0.33, 0.41, 0.57, 0.65], [28, 0, 0, -18]);
  const c3o = useTransform(p, [0.63, 0.71, 1], [0, 1, 1]);
  const c3y = useTransform(p, [0.63, 0.71, 1], [28, 0, 0]);
  const cards = [
    { o: c1o, y: c1y },
    { o: c2o, y: c2y },
    { o: c3o, y: c3y },
  ];

  // Estrella del logo: gira y respira con el recorrido.
  // Estrella en el color opuesto al fondo (sin modos de mezcla, que tiñen la foto), con borde del color del fondo.
  const starFill = useTransform(p, [0, 0.3, 0.5, 0.85, 1], ["#111111", "#111111", "#ffffff", "#ffffff", "#111111"]);
  const starRotate = useTransform(p, [0, 1], [0, 270]);
  const starScale = useTransform(p, [0, 0.5, 1], [0.7, 1.15, 0.9]);

  return (
    <section ref={ref} aria-labelledby="looks-titulo" className="relative h-[300svh] md:h-[340svh]">
      <h2 id="looks-titulo" className="sr-only">
        Una prenda, mil maneras de usarla
      </h2>
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ backgroundColor: bg }} className="absolute inset-0" />

        <motion.div style={{ clipPath }} className="absolute inset-0 overflow-hidden bg-line">
          {looks.map((look, i) => (
            <motion.div key={look.title} style={{ opacity: opacities[i], scale: zoom }} className="absolute inset-0">
              <Image
                src={look.image.src}
                alt={look.image.alt}
                fill
                sizes="(min-width: 768px) 56vw, 92vw"
                style={{ objectPosition: look.image.position, transform: look.image.zoom && !wide ? `scale(${look.image.zoom})` : undefined, transformOrigin: "50% 62%" }}
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.svg
          viewBox="0 0 100 100"
          aria-hidden
          style={{ rotate: starRotate, scale: starScale }}
          className="pointer-events-none absolute right-[6vw] top-[16svh] z-10 size-20 md:right-[9vw] md:size-36"
        >
          <motion.path
            d="M50 0C53 31 69 47 100 50C69 53 53 69 50 100C47 69 31 53 0 50C31 47 47 31 50 0Z"
            style={{ fill: starFill, stroke: bg }}
            strokeWidth={3}
            strokeLinejoin="round"
            paintOrder="stroke"
          />
        </motion.svg>

        {looks.map((look, i) => (
          <motion.article
            key={look.title}
            style={{ opacity: cards[i].o, y: cards[i].y }}
            className="absolute inset-x-4 bottom-6 z-20 bg-white p-5 md:inset-x-auto md:bottom-[10svh] md:left-[5vw] md:w-[22rem] md:p-7"
          >
            <h3 className="display text-3xl md:text-4xl">{look.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-graphite">{look.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/** Con movimiento reducido no hay escena fijada: los tres looks se leen apilados. */
function StaticLooks() {
  return (
    <section aria-labelledby="looks-titulo" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[1480px] px-5 md:px-10">
        <h2 id="looks-titulo" className="display h2-display">
          Una prenda, mil maneras
        </h2>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {looks.map((look) => (
            <li key={look.title}>
              <div className="relative aspect-[3/4] overflow-hidden bg-line">
                <Image src={look.image.src} alt={look.image.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover" />
              </div>
              <h3 className="display mt-4 text-3xl">{look.title}</h3>
              <p className="mt-1 text-graphite">{look.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Looks() {
  const reduce = useReducedMotion() === true;
  return reduce ? <StaticLooks /> : <Scene />;
}
