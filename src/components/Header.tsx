"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { nav, social } from "@/data/site";
import { generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { InstagramIcon } from "./icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const { scrollTo, onAnchorClick } = useAnchorScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
          scrolled || open ? "bg-white" : "bg-transparent"
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
              src="/brand/logo-dark.png"
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
                    className="group relative py-2 text-ink"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:scale-x-100" />
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
              className="press hidden size-11 items-center justify-center rounded-full hover:bg-ink/5 sm:inline-flex"
            >
              <InstagramIcon />
            </a>
            <a
              href={whatsappUrl(generalMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="press hidden h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white hover:bg-graphite sm:inline-flex"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
