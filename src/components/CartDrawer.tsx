"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useLenis } from "lenis/react";
import { categories, formatPrice, products } from "@/data/products";
import { cartMessage, whatsappUrl } from "@/lib/whatsapp";
import { MAX_ITEM_QTY, clearCart, closeCart, removeFromCart, setQty, useShop } from "@/lib/shop-store";

/** Todo lo que se vuelve inerte (no enfocable, no leíble) mientras el carrito está abierto. */
const BACKGROUND = ["header", "main", "footer"];

export function CartDrawer() {
  const { lines, cartOpen, announcement } = useShop();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const rows = useMemo(
    () =>
      lines.flatMap((l) => {
        const product = products.find((p) => p.id === l.id);
        return product ? [{ ...l, product }] : [];
      }),
    [lines],
  );
  const count = rows.reduce((n, r) => n + r.qty, 0);
  const allPriced = rows.length > 0 && rows.every((r) => r.product.price !== null);
  const total = allPriced ? rows.reduce((sum, r) => sum + (r.product.price ?? 0) * r.qty, 0) : null;
  const message = cartMessage(rows.map((r) => ({ name: r.product.name, qty: r.qty })));

  // Foco, scroll y accesibilidad mientras está abierto: se vuelve inerte el fondo y el foco regresa al botón que lo abrió.
  useEffect(() => {
    if (!cartOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const inert = BACKGROUND.flatMap((sel) => Array.from(document.querySelectorAll<HTMLElement>(sel)));
    inert.forEach((el) => el.setAttribute("inert", ""));
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      inert.forEach((el) => el.removeAttribute("inert"));
      document.body.style.overflow = "";
      lenis?.start();
      opener?.focus?.();
    };
  }, [cartOpen, lenis]);

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="scrim"
              aria-hidden
              onClick={closeCart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-ink/40"
            />
            <motion.div
              key="panel"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="carrito-titulo"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-white"
            >
              <div className="flex items-center justify-between border-b border-ink px-4 py-2 md:px-6">
                <h2 id="carrito-titulo" className="t-display text-4xl">
                  Carrito
                </h2>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={closeCart}
                  className="t-label -mr-1 inline-flex min-h-11 items-center px-1 underline underline-offset-4 hover:no-underline"
                >
                  Cerrar<span className="sr-only"> carrito</span>
                </button>
              </div>

              {rows.length === 0 ? (
                <div className="flex flex-1 flex-col justify-center px-4 pb-16 md:px-6">
                  <p className="text-lg leading-snug">Todavía no agregaste prendas.</p>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">
                    Tocá «Agregar +» en cualquier prenda y armá tu consulta: te llevamos a WhatsApp con la lista lista para enviar.
                  </p>
                  <button type="button" onClick={closeCart} className="btn btn-line mt-6 w-fit">
                    Seguir mirando
                  </button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 overflow-y-auto px-4 md:px-6">
                    {rows.map(({ id, qty, product }) => (
                      <li key={id} className="flex gap-4 border-b border-line py-4">
                        <div className="relative size-24 shrink-0 bg-paper">
                          <Image
                            src={product.image.src}
                            alt=""
                            fill
                            sizes="96px"
                            style={{ objectPosition: product.image.position }}
                            className={product.image.fit === "contain" ? "object-contain p-1" : "object-cover"}
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <p className="t-label text-balance">{product.name}</p>
                            <p className="t-label mt-1 text-mid">
                              {categories.find((c) => c.id === product.category)?.label} — {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="inline-flex items-center border border-line">
                              <button
                                type="button"
                                onClick={() => setQty(id, qty - 1)}
                                aria-label={`Quitar una unidad de ${product.name}`}
                                className="inline-flex size-11 items-center justify-center text-lg hover:bg-paper"
                              >
                                <span aria-hidden>−</span>
                              </button>
                              <span aria-live="polite" className="t-label min-w-6 text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(id, qty + 1)}
                                disabled={qty >= MAX_ITEM_QTY}
                                aria-label={`Agregar una unidad de ${product.name}`}
                                className="inline-flex size-11 items-center justify-center text-lg hover:bg-paper disabled:opacity-40"
                              >
                                <span aria-hidden>+</span>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(id)}
                              className="t-label inline-flex min-h-11 items-center px-1 text-graphite underline underline-offset-4 hover:text-ink hover:no-underline"
                            >
                              Quitar<span className="sr-only"> {product.name}</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 border-t border-ink bg-white px-4 py-4 md:px-6">
                    <div className="t-label flex items-baseline justify-between">
                      <p>
                        {count} {count === 1 ? "prenda" : "prendas"}
                      </p>
                      <p>{total === null ? "Precios a consultar" : formatPrice(total)}</p>
                    </div>
                    <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn w-full">
                      Consultar por WhatsApp
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                    <p className="text-xs leading-snug text-graphite">
                      Se abre WhatsApp con tu lista ya escrita. La compra se cierra por chat con la tienda; acá no se paga.
                    </p>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="t-label inline-flex min-h-11 items-center text-graphite underline underline-offset-4 hover:text-ink hover:no-underline"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
