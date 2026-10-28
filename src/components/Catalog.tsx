"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { categories, products, type CategoryId } from "@/data/products";
import { categoryMessage, generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { matches } from "@/lib/search";
import { setQuery, useShop } from "@/lib/shop-store";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

type Filter = "todo" | Exclude<CategoryId, "vestidos">;

/**
 * Categorías (entrada a la colección) y grilla de prendas. Una sola fuente de filtro:
 * tocar una categoría o un chip cambia el mismo estado, y el buscador del header lo reemplaza
 * mientras haya texto escrito.
 */
export function Catalog() {
  const [filter, setFilter] = useState<Filter>("todo");
  const { query } = useShop();
  const { scrollTo } = useAnchorScroll();
  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    if (searching) return products.filter((p) => matches(p, query));
    return filter === "todo" ? products : products.filter((p) => p.category === filter);
  }, [filter, query, searching]);

  const filterChips = useMemo(
    () => [
      { id: "todo" as const, label: "Todo", count: products.length },
      ...categories
        .filter((c) => products.some((p) => p.category === c.id))
        .map((c) => ({
          id: c.id as Filter,
          label: c.label,
          count: products.filter((p) => p.category === c.id).length,
        })),
    ],
    [],
  );

  const chooseCategory = useCallback(
    (id: Filter) => {
      setQuery("");
      setFilter(id);
      scrollTo("#prendas");
    },
    [scrollTo],
  );

  return (
    <>
      <section id="coleccion" data-nav="coleccion" aria-labelledby="categorias-titulo" className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1480px] px-5 md:px-10">
          <Reveal>
            <h2 id="categorias-titulo" className="display h2-display">
              Elegí por
              <br />
              dónde empezar
            </h2>
          </Reveal>

          <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
            {categories.map((cat, i) => {
              const count = products.filter((p) => p.category === cat.id).length;
              const inner = (
                <>
                  <div className="relative aspect-[3/4] overflow-hidden bg-line">
                    {cat.image ? (
                      <Image
                        src={cat.image.src}
                        alt={cat.image.alt}
                        fill
                        sizes="(min-width: 1024px) 24vw, 48vw"
                        style={{ objectPosition: cat.image.position }}
                        className="object-cover transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="on-dark flex size-full flex-col justify-between bg-ink p-5 text-white">
                        <Image src="/brand/logo-light.png" alt="" width={900} height={363} className="h-6 w-auto self-start" />
                        <p className="display text-xl md:text-2xl">Consultá disponibilidad</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="display text-2xl md:text-3xl">{cat.label}</h3>
                      <p className="mt-1 text-base text-graphite">
                        {cat.image
                          ? `${count} ${count === 1 ? "prenda" : "prendas"} en la colección`
                          : "Escribinos por WhatsApp"}
                      </p>
                    </div>
                    {cat.image ? (
                      <ArrowUpRight
                        aria-hidden
                        className="mt-1 shrink-0 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    ) : (
                      <MessageCircle aria-hidden className="mt-1 shrink-0" />
                    )}
                  </div>
                </>
              );

              return (
                <li key={cat.id} className={i % 2 === 1 ? "lg:mt-14" : ""}>
                  <Reveal delay={(i % 4) * 0.06}>
                    {cat.id === "vestidos" ? (
                      <a
                        href={whatsappUrl(categoryMessage(cat.label))}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Consultar por vestidos por WhatsApp (se abre en una pestaña nueva)"
                        className="group block"
                      >
                        {inner}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => chooseCategory(cat.id as Filter)}
                        aria-label={`Ver ${cat.label.toLowerCase()} en la colección`}
                        className="group block w-full text-left"
                      >
                        {inner}
                      </button>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="prendas" data-nav="coleccion" aria-labelledby="prendas-titulo" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1480px] px-5 md:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <h2 id="prendas-titulo" className="display h2-display">
                Lo que hay
                <br />
                en el local
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="max-w-xs text-graphite">
              <p className="text-base leading-relaxed">
                Sumá prendas al carrito con el botón + y consultá todo junto por WhatsApp.
              </p>
            </Reveal>
          </div>

          <div role="group" aria-label="Filtrar por categoría" className="mt-10 flex flex-wrap items-center gap-2">
            {filterChips.map((chip) => {
              const active = !searching && filter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setQuery("");
                    setFilter(chip.id);
                  }}
                  className={`press inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ${
                    active ? "bg-ink text-white" : "bg-paper text-ink hover:bg-line"
                  }`}
                >
                  {chip.label}
                  <span className={active ? "text-white/70" : "text-graphite"}>{chip.count}</span>
                </button>
              );
            })}
            {searching && (
              <p className="ml-2 text-base text-graphite" aria-live="polite">
                {visible.length} {visible.length === 1 ? "resultado" : "resultados"} para «{query.trim()}»
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="press ml-3 inline-flex h-11 items-center text-ink underline underline-offset-4"
                >
                  Borrar búsqueda
                </button>
              </p>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="mt-12 max-w-md">
              <p className="text-xl leading-snug">No encontramos prendas con esa búsqueda.</p>
              <p className="mt-2 text-graphite">Escribinos por WhatsApp y te contamos qué tenemos.</p>
              <a
                href={whatsappUrl(generalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="press mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-base font-medium text-white hover:bg-graphite"
              >
                <MessageCircle size={18} aria-hidden />
                Consultar por WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </div>
          ) : (
            <div className="mt-8 columns-2 gap-3 md:gap-5 lg:columns-4">
              <AnimatePresence mode="popLayout">
                {visible.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout="position"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="break-inside-avoid"
                  >
                    <Reveal delay={(i % 4) * 0.06}>
                      <ProductCard product={product} priority={i < 2} />
                    </Reveal>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <p className="mt-6 text-sm text-graphite">
            Nombres de prendas y precios a confirmar por la tienda. Consultá disponibilidad y talles por WhatsApp.
          </p>
        </div>
      </section>
    </>
  );
}
