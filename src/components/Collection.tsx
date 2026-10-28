"use client";

import Image from "next/image";
import { useMemo } from "react";
import { categories, editorial, products, type CategoryId } from "@/data/products";
import { categoryMessage, generalMessage, whatsappUrl } from "@/lib/whatsapp";
import { matches } from "@/lib/search";
import { setQuery, useShop } from "@/lib/shop-store";
import { useAnchorScroll } from "@/lib/useAnchorScroll";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

const ENTRIES: { id: CategoryId; product?: string }[] = [
  { id: "tops", product: "remera-cruz-negra" },
  { id: "pantalones", product: "jean-baggy-negro" },
  { id: "noche", product: "tops-encaje-tubo" },
  { id: "vestidos" },
];

const GRID = "grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 md:gap-x-3 md:gap-y-12 lg:grid-cols-4";

/**
 * La colección en una sola página, ordenada por categoría y numerada como un índice.
 * Entre bloques hay una doble página con fotografías de modelos. Con una búsqueda activa,
 * las categorías se reemplazan por una única lista de resultados.
 */
export function Collection() {
  const { query } = useShop();
  const { scrollTo } = useAnchorScroll();
  const searching = query.trim().length > 0;
  const results = useMemo(() => (searching ? products.filter((p) => matches(p, query)) : []), [query, searching]);

  const block = (id: CategoryId, n: number) => {
    const cat = categories.find((c) => c.id === id)!;
    const items = products.filter((p) => p.category === id);
    return (
      <div key={id} id={`cat-${id}`} className="scroll-mt-[var(--header-h)] pt-12 md:pt-20">
        <Reveal className="flex items-end justify-between gap-4 border-b border-ink pb-3">
          <h3 data-title className="t-display text-5xl md:text-7xl">
            <span className="t-label tag mr-3 align-top text-mid">{String(n).padStart(2, "0")}</span>
            {cat.label}
          </h3>
          <p className="t-label hidden max-w-[34ch] text-right text-graphite md:block">{cat.blurb}</p>
        </Reveal>
        <div className={`${GRID} mt-6`}>
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} priority={n === 1 && i < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="coleccion" data-nav="coleccion" aria-labelledby="coleccion-titulo" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <h2 id="coleccion-titulo" data-title className="t-display text-[clamp(3.5rem,11vw,10rem)]">
              Colección
            </h2>
          </Reveal>
        </div>

        {/* Índice de categorías: cada celda lleva el rótulo subrayado arriba y una prenda recortada, como en Deadly Ponies. */}
        <ul aria-label="Ir a una categoría" className="mt-8 grid grid-cols-2 gap-2 md:mt-12 md:grid-cols-4 md:gap-3">
          {ENTRIES.map((entry, i) => {
            const cat = categories.find((c) => c.id === entry.id)!;
            const count = products.filter((p) => p.category === entry.id).length;
            const product = entry.product && products.find((p) => p.id === entry.product);
            const inner = (
              <>
                <span className="t-label link-grow tap relative z-10 self-start">
                  {cat.label}
                  {product ? ` (${count})` : ""}
                </span>
                {product ? (
                  <span className="relative mt-3 block aspect-[4/5] flex-1">
                    <Image
                      src={product.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 24vw, 46vw"
                      className="object-contain p-2 transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-105"
                    />
                  </span>
                ) : (
                  <span className="t-caption mt-3 block flex-1 self-end pt-24 text-graphite">
                    Consultá disponibilidad por WhatsApp
                  </span>
                )}
              </>
            );
            const cell = "group tap flex min-h-64 w-full flex-col bg-paper p-3 text-left transition-colors duration-300 hover:bg-line";
            return (
              <Reveal as="li" key={entry.id} delay={i * 0.05}>
                {product ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      window.setTimeout(() => scrollTo(`#cat-${entry.id}`), 30);
                    }}
                    aria-label={`Ir a ${cat.label}`}
                    className={cell}
                  >
                    {inner}
                  </button>
                ) : (
                  <a
                    href={whatsappUrl(categoryMessage(cat.label))}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Consultar por ${cat.label.toLowerCase()} por WhatsApp (se abre en una pestaña nueva)`}
                    className={cell}
                  >
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </ul>

        <div id="prendas" className="scroll-mt-[var(--header-h)]">
          {searching ? (
            <div className="pt-8" aria-live="polite">
              <p className="t-label border-b border-ink pb-3">
                {results.length} {results.length === 1 ? "resultado" : "resultados"} para «{query.trim()}»
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="t-label ml-4 inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline"
                >
                  Borrar búsqueda
                </button>
              </p>
              {results.length === 0 ? (
                <div className="mt-8 max-w-md">
                  <p className="text-lg leading-snug">No encontramos prendas con esa búsqueda.</p>
                  <a
                    href={whatsappUrl(generalMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-5"
                  >
                    Consultar por WhatsApp
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </div>
              ) : (
                <div className={`${GRID} mt-6`}>
                  {results.map((p, i) => (
                    <ProductCard key={p.id} product={p} priority={i < 2} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {block("tops", 1)}
              {block("pantalones", 2)}

              <Reveal className="mt-12 grid grid-cols-5 gap-2 md:mt-20 md:grid-cols-12 md:gap-3">
                <div data-parallax="6" className="col-span-3 md:col-span-4 md:col-start-2">
                  <Image
                    src={editorial.spreadA.src}
                    alt={editorial.spreadA.alt}
                    width={editorial.spreadA.width}
                    height={editorial.spreadA.height}
                    sizes="(min-width: 768px) 33vw, 60vw"
                    className="h-auto w-full"
                  />
                  <button
                    type="button"
                    onClick={() => scrollTo("#cat-pantalones")}
                    className="t-label link-grow tap mt-1 inline-flex min-h-11 items-center"
                  >
                    Pantalones
                  </button>
                </div>
                <div data-parallax="10" className="col-span-2 self-end md:col-span-5 md:col-start-7">
                  <Image
                    src={editorial.spreadB.src}
                    alt={editorial.spreadB.alt}
                    width={editorial.spreadB.width}
                    height={editorial.spreadB.height}
                    sizes="(min-width: 768px) 40vw, 40vw"
                    className="h-auto w-full"
                  />
                  <button
                    type="button"
                    onClick={() => scrollTo("#cat-pantalones")}
                    className="t-label link-grow tap mt-1 inline-flex min-h-11 items-center"
                  >
                    Ver jeans
                  </button>
                </div>
              </Reveal>

              {block("noche", 3)}

              <Reveal className="mt-12 flex flex-col gap-3 border-y border-ink py-5 md:mt-20 md:flex-row md:items-baseline md:justify-between">
                <h3 className="t-display text-5xl md:text-7xl">
                  <span className="t-label tag mr-3 align-top text-mid">04</span>
                  Vestidos
                </h3>
                <a
                  href={whatsappUrl(categoryMessage("Vestidos"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-label inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline"
                >
                  Consultar disponibilidad por WhatsApp
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </Reveal>
            </>
          )}
        </div>

        <p className="t-label mt-10 text-mid">
          Nombres y precios a confirmar por la tienda. Consultá disponibilidad y talles por WhatsApp.
        </p>
      </div>
    </section>
  );
}
