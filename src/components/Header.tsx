"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { nav, social } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { closeSearch, openCart, openSearch, useShop } from "@/lib/shop-store";

/** Enlaces de la barra: «Inicio» es el logo, así que no se repite como texto. */
const links = nav.filter((item) => item.href !== "#inicio");

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

  const control = "t-label inline-flex min-h-11 items-center px-1 max-md:px-0.5 hover:underline hover:underline-offset-4";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white text-ink">
        <div className="mx-auto grid h-[var(--header-h)] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              className={`${control} md:hidden`}
            >
              {open ? "Cerrar" : "Menú"}
            </button>
            <nav aria-label="Principal" className="hidden md:block">
              <ul className="flex items-center gap-6">
                {links.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={onAnchorClick}
                      aria-current={active === item.href.slice(1) ? "location" : undefined}
                      className={`${control} aria-[current=location]:underline aria-[current=location]:underline-offset-4`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
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
              className={control}
            >
              Carrito<span aria-hidden className="ml-1">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-white md:hidden"
          >
            <nav aria-label="Menú móvil" className="flex min-h-full flex-col justify-between px-4 pb-8 pt-4">
              <ul className="border-t border-ink">
                {nav.map((item, i) => (
                  <li key={item.href} className="border-b border-line">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(item.href);
                      }}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span className="t-label tag w-14 shrink-0 text-mid">{String(i + 1).padStart(2, "0")}</span>
                      <span className="t-display text-5xl">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mt-10 flex flex-col gap-1">
                <li>
                  <a
                    href={whatsappUrl(generalMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-label inline-flex min-h-11 items-center underline underline-offset-4"
                  >
                    WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-label inline-flex min-h-11 items-center underline underline-offset-4"
                  >
                    Instagram {social.instagram.handle}
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
