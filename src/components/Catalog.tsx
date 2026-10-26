"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, products, type CategoryId } from "@/data/products";
import { categoryMessage, whatsappUrl } from "@/lib/whatsapp";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

type Filter = "todo" | Exclude<CategoryId, "vestidos">;

/** Colección + categorías comparten el filtro: tocar una categoría filtra la grilla. */
export function Catalog() {
  const [filter, setFilter] = useState<Filter>("todo");
  const [openId, setOpenId] = useState<string | null>(null);
  const { scrollTo } = useAnchorScroll();

  const visible = useMemo(
    () => (filter === "todo" ? products : products.filter((p) => p.category === filter)),
    [filter],
  );

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

  // Tocar fuera de una tarjeta (o Escape) cierra el detalle abierto en pantallas táctiles.
  useEffect(() => {
    if (!openId) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-card]")) setOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const chooseCategory = useCallback(
    (id: Filter) => {
      setFilter(id);
      setOpenId(null);
      scrollTo("#coleccion");
    },
    [scrollTo],
  );

  return (
    <>
      <section id="coleccion" aria-labelledby="coleccion-titulo" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1480px] px-5 md:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <h2 id="coleccion-titulo" className="display h2-display">
                Lo que hay
                <br />
                en el local
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="max-w-xs text-graphite">
              <p className="text-base leading-relaxed">
                <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">Pasá el cursor</span>
                <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">Tocá una prenda</span> para ver el
                detalle y consultar por WhatsApp.
              </p>
            </Reveal>
          </div>

          <div role="group" aria-label="Filtrar por categoría" className="mt-10 flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={filter === chip.id}
                onClick={() => {
                  setFilter(chip.id);
                  setOpenId(null);
                }}
                className={`press inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ${
                  filter === chip.id
                    ? "bg-ink text-white"
                    : "bg-paper text-ink hover:bg-line"
                }`}
              >
                {chip.label}
                <span className={filter === chip.id ? "text-white/70" : "text-graphite"}>{chip.count}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 columns-2 gap-3 md:gap-5 lg:columns-4" aria-live="polite">
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
                    <ProductCard
                      product={product}
                      open={openId === product.id}
                      onToggle={() => setOpenId((cur) => (cur === product.id ? null : product.id))}
                      priority={i < 2}
                    />
                  </Reveal>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-sm text-graphite">
            Nombres de prendas y precios a confirmar por la tienda. Consultá disponibilidad y talles por WhatsApp.
          </p>
        </div>
      </section>

      <section id="categorias" aria-labelledby="categorias-titulo" className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1480px] px-5 md:px-10">
          <Reveal>
            <h2 id="categorias-titulo" className="display h2-display">
              Elegí por dónde empezar
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
                        className="object-cover transition-transform duration-[700ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="on-dark flex size-full flex-col justify-between bg-ink p-5 text-white">
                        <Image src="/brand/logo-light.png" alt="" width={900} height={363} className="h-6 w-auto self-start" />
                        <p className="display text-3xl md:text-4xl">Consultá disponibilidad</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="display text-2xl md:text-3xl">{cat.label}</h3>
                      <p className="mt-1 text-sm text-graphite">
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
    </>
  );
}
