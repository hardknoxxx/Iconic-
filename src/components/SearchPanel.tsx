"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
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
          className="fixed inset-x-0 top-[var(--header-h)] z-40 bg-white px-5 pb-5 pt-3 md:px-10"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollTo("#prendas");
              if (window.matchMedia("(max-width: 767px)").matches) closeSearch();
            }}
            className="mx-auto flex max-w-[1480px] items-center gap-3"
          >
            <label htmlFor="buscar" className="sr-only">
              Buscar prenda
            </label>
            <Search size={20} aria-hidden className="shrink-0 text-graphite" />
            <input
              id="buscar"
              ref={input}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: jean, remera, encaje…"
              autoComplete="off"
              enterKeyHint="search"
              className="h-12 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-graphite"
            />
            <span aria-live="polite" className="hidden text-sm text-graphite sm:inline">
              {query.trim() ? `${found} ${found === 1 ? "resultado" : "resultados"}` : ""}
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                closeSearch();
              }}
              aria-label="Cerrar buscador"
              className="press inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-paper"
            >
              <X size={20} aria-hidden />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
