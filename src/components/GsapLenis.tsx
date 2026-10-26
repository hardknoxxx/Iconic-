"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Mantiene ScrollTrigger sincronizado con el scroll suave de Lenis. */
export function GsapLenis() {
  useLenis(() => ScrollTrigger.update());
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);
  return null;
}
