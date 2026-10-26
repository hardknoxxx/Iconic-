"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Entrada al hacer scroll, una sola vez. El estado oculto solo existe si el script de <head>
 * marcó <html class="js">, así que sin JavaScript el contenido se ve igual.
 * Es una transición CSS (transform + opacity): corre fuera del hilo principal y se puede interrumpir.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}s` }}>
      {children}
    </Tag>
  );
}
