"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const els = <T extends HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector);

/**
 * Efectos atados al scroll, declarados con atributos de datos en el marcado y creados en el orden de la página
 * (arriba a abajo), que es el que ScrollTrigger necesita para calcular bien los espacios de los pines.
 *  - data-title: los titulares se destapan con una máscara al entrar en vista.
 *  - data-parallax="n": el elemento se desplaza ±n % de su alto mientras cruza la pantalla.
 *  - data-drag="desde,hasta": el elemento se arrastra en horizontal (en % de su ancho) con el scroll.
 *    data-drag-start="top top" cambia el punto de arranque (por defecto, cuando asoma por abajo).
 *  - data-hscroll: la sección se fija y su [data-track] avanza en horizontal; cada [data-lag="n"] se adelanta
 *    o se retrasa n veces el recorrido, para que las fotos se arrastren a distinta velocidad, en capas.
 *  - data-rise: el elemento sube desde abajo mientras el final de la página llega.
 * Lenis mueve el scroll nativo, así que alcanza con avisarle a ScrollTrigger en cada paso.
 * Con prefers-reduced-motion no se registra nada: todo queda en su estado final y el lookbook se desliza con el dedo.
 */
export function GsapScroll() {
  useLenis(() => ScrollTrigger.update());

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      els("[data-title]").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          yPercent: 35,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      els("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax ?? "0");
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });

      els("[data-drag]").forEach((el) => {
        const [from, to] = (el.dataset.drag ?? "0,0").split(",").map(parseFloat);
        gsap.fromTo(
          el,
          { xPercent: from },
          {
            xPercent: to,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: el.dataset.dragStart ?? "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });

      els("[data-hscroll]").forEach((section) => {
        const track = section.querySelector<HTMLElement>("[data-track]");
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        section.style.overflowX = "hidden";

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance() }, 0);
        els("[data-lag]").filter((el) => section.contains(el)).forEach((el) => {
          const lag = parseFloat(el.dataset.lag ?? "0");
          tl.to(el, { x: () => lag * distance() }, 0);
        });
        return () => {
          section.style.overflowX = "";
        };
      });

      els("[data-rise]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 45 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
      });

      // Las tipografías cambian las alturas: se recalcula cuando terminan de cargar.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });
    return () => mm.revert();
  });

  return null;
}
