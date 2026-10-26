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
      const offset = hash === "#inicio" ? 0 : -parseFloat(getComputedStyle(document.documentElement).fontSize) * 4;
      if (lenis) {
        lenis.scrollTo(el, { offset, immediate: reduce, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
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
