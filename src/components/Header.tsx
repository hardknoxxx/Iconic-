"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { nav, social } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { closeSearch, openCart, openSearch, useShop } from "@/lib/shop-store";
import { InstagramIcon } from "./icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [dark, setDark] = useState(false);
  const { lines, searchOpen } = useShop();
  const cartCount = lines.reduce((n, l) => n + l.qty, 0);
  const lenis = useLenis();
  const { scrollTo, onAnchorClick } = useAnchorScroll();

  useEffect(() => {
    // Qué sección queda justo bajo el header: marca el enlace activo y pasa el header a oscuro sobre secciones negras.
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const y = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25 + 1;
      let current = "inicio";
      let isDark = false;
      document.querySelectorAll<HTMLElement>("[data-nav]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) {
          current = el.dataset.nav || current;
          isDark = el.hasAttribute("data-dark");
        }
      });
      setActive(current);
      setDark(isDark);
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
    // Damos un instante para que el efecto del menú libere el bloqueo de scroll.
    window.setTimeout(() => scrollTo(href), 60);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color] duration-200 ease-[var(--ease-out-strong)] ${
          open
            ? "bg-white text-ink"
            : scrolled
              ? dark
                ? "header-glass-dark text-white"
                : "header-glass text-ink"
              : "bg-transparent text-ink"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1480px] items-center justify-between px-5 md:px-10">
          <a
            href="#inicio"
            onClick={onAnchorClick}
            aria-label="ICONIC — ir al inicio"
            className="press -ml-1 block p-1"
          >
            <Image
              src={dark && scrolled && !open ? "/brand/logo-light.png" : "/brand/logo-dark.png"}
              alt="ICONIC"
              width={900}
              height={363}
              priority
              className="h-8 w-auto md:h-9"
            />
          </a>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-9 text-sm font-medium">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onAnchorClick}
                    aria-current={active === item.href.slice(1) ? "location" : undefined}
                    className="group relative inline-flex min-h-11 items-center"
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-0 bottom-2 h-0.5 origin-left bg-current transition-transform duration-200 ease-[var(--ease-out-strong)] ${
                        active === item.href.slice(1) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de ICONIC (se abre en una pestaña nueva)"
              className="press hidden size-11 items-center justify-center rounded-full hover:bg-current/10 sm:inline-flex"
            >
              <InstagramIcon />
            </a>
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : openSearch())}
              aria-expanded={searchOpen}
              aria-controls="buscar"
              aria-label="Buscar prenda"
              className="press inline-flex size-11 items-center justify-center rounded-full hover:bg-current/10"
            >
              <Search size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={cartCount > 0 ? `Abrir carrito, ${cartCount} ${cartCount === 1 ? "prenda" : "prendas"}` : "Abrir carrito"}
              className="press relative inline-flex size-11 items-center justify-center rounded-full hover:bg-current/10"
            >
              <ShoppingBag size={20} aria-hidden />
              {cartCount > 0 && (
                <span
                  aria-hidden
                  className="absolute right-0 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.6875rem] font-semibold leading-5 text-ink"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <a
              href={whatsappUrl(generalMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={`press hidden h-11 items-center gap-2 rounded-full px-5 text-sm font-medium sm:inline-flex ${
                dark && scrolled && !open ? "bg-white text-ink hover:bg-line" : "bg-ink text-white hover:bg-graphite"
              }`}
            >
              <MessageCircle size={18} aria-hidden />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="press -mr-2 inline-flex size-11 items-center justify-center rounded-full md:hidden"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            /* Nace del botón de menú (arriba a la derecha) y vuelve por el mismo camino;
               se "materializa" con blur + escala, no con un simple fundido. */
            initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "100% 0%" }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-white md:hidden"
          >
            <nav
              aria-label="Menú móvil"
              className="flex min-h-full flex-col justify-between px-5 pb-8 pt-6"
            >
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.23, 1, 0.32, 1],
                      delay: 0.04 * i,
                    }}
                    className=""
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(item.href);
                      }}
                      className="display block py-5 text-4xl"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3">
                <a
                  href={whatsappUrl(generalMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-base font-medium text-white"
                >
                  <MessageCircle size={20} aria-hidden />
                  Escribinos por WhatsApp
                </a>
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex h-14 items-center justify-center gap-2 rounded-full bg-paper text-base font-medium"
                >
                  <InstagramIcon />
                  {social.instagram.handle}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
