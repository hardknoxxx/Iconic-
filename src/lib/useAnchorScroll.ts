"use client";

import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, type MouseEvent } from "react";

/** Scroll a un ancla interna usando Lenis cuando existe y scroll nativo si no. */
export function useAnchorScroll() {
  const lenis = useLenis();
  const reduce = useReducedMotion() === true;

  const scrollTo = useCallback(
    (hash: string) => {
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return false;
      // Posición absoluta calculada a mano: el hero está fijado (pin) y no se puede medir como un ancla común.
      const header = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.5;
      const y = hash === "#inicio" ? 0 : Math.round(el.getBoundingClientRect().top + window.scrollY - header);
      if (lenis) {
        lenis.scrollTo(y, { immediate: reduce, duration: 1.4 });
      } else {
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }
      history.replaceState(null, "", hash);
      return true;
    },
    [lenis, reduce],
  );

  const onAnchorClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href?.startsWith("#")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (scrollTo(href)) e.preventDefault();
    },
    [scrollTo],
  );

  return { scrollTo, onAnchorClick };
}
