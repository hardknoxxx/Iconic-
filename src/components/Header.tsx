"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { nav, social } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { closeSearch, openCart, openSearch, useShop } from "@/lib/shop-store";
import { BagIcon } from "./icons";

const STEPS = 6;
const STAIR_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Barra utilitaria de tres zonas: navegación a la izquierda, logo al centro, buscar y carrito a la derecha.
 * Texto en mayúsculas chicas, sin iconos decorativos ni fondos redondeados.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const { lines, searchOpen } = useShop();
  const cartCount = lines.reduce((n, l) => n + l.qty, 0);
  const lenis = useLenis();
  const { scrollTo, onAnchorClick } = useAnchorScroll();

  useEffect(() => {
    // Qué sección queda justo bajo el header: marca el enlace activo.
    const onScroll = () => {
      const y = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.5 + 1;
      let current = "inicio";
      document.querySelectorAll<HTMLElement>("[data-nav]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) current = el.dataset.nav || current;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El menú móvil bloquea el scroll de la página (también el de Lenis) y se cierra con Escape.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const goTo = (href: string) => {
    // Reactivamos el scroll antes de movernos: Lenis ignora scrollTo mientras está detenido.
    lenis?.start();
    setOpen(false);
    window.setTimeout(() => scrollTo(href), 60);
  };

  const control = "tap t-label link-grow inline-flex min-h-11 items-center px-1 max-md:px-0.5";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white text-ink">
        <div className="mx-auto grid h-[var(--header-h)] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-lateral"
              className={control}
            >
              {open ? "Cerrar" : "Menú"}
            </button>
          </div>

          <a href="#inicio" onClick={onAnchorClick} aria-label="ICONIC — ir al inicio" className="block px-2 py-2">
            <Image src="/brand/logo-dark.png" alt="ICONIC" width={900} height={363} priority className="h-6 w-auto md:h-8" />
          </a>

          <div className="flex items-center justify-end gap-0 md:gap-3">
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : openSearch())}
              aria-expanded={searchOpen}
              aria-controls="buscar"
              className={control}
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={cartCount > 0 ? `Abrir carrito, ${cartCount} ${cartCount === 1 ? "prenda" : "prendas"}` : "Abrir carrito"}
              className="tap relative inline-flex size-11 items-center justify-center"
            >
              <BagIcon />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  aria-hidden
                  className="bump t-label absolute right-0.5 top-1.5 inline-flex min-w-4 items-center justify-center bg-ink px-1 text-[0.625rem] font-semibold leading-4 text-white"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-lateral"
            initial="out"
            animate="in"
            exit="out"
            className="on-dark fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40"
          >
            {/* En escritorio el resto de la página queda atenuado y un clic ahí cierra el menú. */}
            <motion.div
              aria-hidden
              onClick={() => setOpen(false)}
              variants={{ in: { opacity: 1 }, out: { opacity: 0 } }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 hidden bg-ink/30 md:block"
            />

            <div className="relative h-full w-full overflow-hidden md:w-[30rem]">
              {/* Escalones: seis franjas negras que se extienden desde el borde izquierdo, de arriba hacia abajo.
                  Al cerrar se recogen hacia ese mismo borde en orden inverso, de abajo hacia arriba. */}
              <div aria-hidden className="absolute inset-0 flex flex-col">
                {Array.from({ length: STEPS }, (_, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      in: { scaleX: 1, transition: { duration: 0.5, ease: STAIR_EASE, delay: i * 0.06 } },
                      out: { scaleX: 0, transition: { duration: 0.4, ease: STAIR_EASE, delay: (STEPS - 1 - i) * 0.05 } },
                    }}
                    style={{ transformOrigin: "left" }}
                    className="flex-1 bg-ink"
                  />
                ))}
              </div>

              <nav aria-label="Menú" className="relative flex h-full flex-col justify-between overflow-y-auto px-4 pb-8 pt-4 text-white md:px-8">
                <ul className="border-t border-white/40">
                  {nav.map((item, i) => (
                    <li key={item.href} className="overflow-hidden border-b border-white/15">
                      <motion.a
                        href={item.href}
                        aria-current={active === item.href.slice(1) ? "location" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          goTo(item.href);
                        }}
                        variants={{
                          in: { y: 0, transition: { duration: 0.55, ease: STAIR_EASE, delay: 0.3 + i * 0.07 } },
                          out: { y: "105%", transition: { duration: 0.25, ease: STAIR_EASE } },
                        }}
                        className="group flex items-baseline gap-4 py-4"
                      >
                        <span className="t-label tag w-14 shrink-0 text-white/50">{String(i + 1).padStart(2, "0")}</span>
                        <span className="t-display text-5xl transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-2 group-aria-[current=location]:translate-x-2">
                          {item.label}
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
                <motion.ul
                  variants={{
                    in: { opacity: 1, transition: { delay: 0.7, duration: 0.3 } },
                    out: { opacity: 0, transition: { duration: 0.15 } },
                  }}
                  className="mt-10 flex flex-col gap-1"
                >
                  <li>
                    <a
                      href={whatsappUrl(generalMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-label inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline"
                    >
                      WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-label inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline"
                    >
                      Instagram {social.instagram.handle}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                </motion.ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
