"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { products } from "@/data/products";
import { closeSearch, setQuery, useShop } from "@/lib/shop-store";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { matches } from "@/lib/search";

/** Buscador de la colección: filtra la grilla en vivo; Enter lleva a las prendas. */
export function SearchPanel() {
  const { searchOpen, query } = useShop();
  const input = useRef<HTMLInputElement>(null);
  const { scrollTo } = useAnchorScroll();
  const found = query.trim() ? products.filter((p) => matches(p, query)).length : products.length;

  useEffect(() => {
    if (!searchOpen) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="search"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="on-dark fixed inset-x-0 top-[var(--header-h)] z-40 border-b border-white/30 bg-ink px-4 pb-4 pt-2 text-white md:px-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollTo("#prendas");
              if (window.matchMedia("(max-width: 767px)").matches) closeSearch();
            }}
            className="mx-auto flex max-w-[1600px] items-center gap-4"
          >
            <label htmlFor="buscar" className="sr-only">
              Buscar prenda
            </label>
            <input
              id="buscar"
              ref={input}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="BUSCAR: JEAN, REMERA, ENCAJE…"
              autoComplete="off"
              enterKeyHint="search"
              className="t-title h-14 min-w-0 flex-1 bg-transparent text-3xl outline-none focus-visible:outline-none placeholder:text-white/40 md:text-5xl"
            />
            <span aria-live="polite" className="t-label hidden text-white/70 sm:inline">
              {query.trim() ? `${found} ${found === 1 ? "resultado" : "resultados"}` : ""}
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                closeSearch();
              }}
              className="t-label inline-flex min-h-11 shrink-0 items-center underline underline-offset-4 hover:no-underline"
            >
              Cerrar<span className="sr-only"> buscador</span>
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
