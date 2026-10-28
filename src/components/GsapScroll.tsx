"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Animaciones atadas al scroll, declaradas con atributos de datos en el marcado:
 *  - data-parallax="n": el elemento se desplaza ±n% de su alto mientras cruza la pantalla.
 *  - data-title: los titulares se destapan con una máscara al entrar en vista.
 * Lenis mueve el scroll nativo, así que alcanza con avisarle a ScrollTrigger en cada paso.
 * Con prefers-reduced-motion no se registra nada y todo queda en su estado final.
 */
export function GsapScroll() {
  useLenis(() => ScrollTrigger.update());

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax ?? "0");
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-title]").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          yPercent: 35,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });
    return () => mm.revert();
  });

  return null;
}
