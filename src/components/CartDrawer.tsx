"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, MessageCircle, Plus, X } from "lucide-react";
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
              className="fixed inset-0 z-[60] bg-ink/50"
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
              <div className="flex items-center justify-between px-5 py-4 md:px-6">
                <h2 id="carrito-titulo" className="display text-3xl">
                  Carrito
                </h2>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={closeCart}
                  aria-label="Cerrar carrito"
                  className="press -mr-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-paper"
                >
                  <X size={22} aria-hidden />
                </button>
              </div>

              {rows.length === 0 ? (
                <div className="flex flex-1 flex-col justify-center px-5 pb-16 md:px-6">
                  <p className="text-xl leading-snug">Todavía no agregaste prendas.</p>
                  <p className="mt-2 text-graphite">
                    Tocá el botón + de cualquier prenda y armá tu consulta: te llevamos a WhatsApp con la lista lista para enviar.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="press mt-6 inline-flex h-12 w-fit items-center rounded-full bg-ink px-7 text-base font-medium text-white hover:bg-graphite"
                  >
                    Seguir mirando
                  </button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 space-y-3 overflow-y-auto px-5 pb-4 md:px-6">
                    {rows.map(({ id, qty, product }) => (
                      <li key={id} className="flex gap-4 bg-paper p-3">
                        <Image
                          src={product.image.src}
                          alt=""
                          width={product.image.width}
                          height={product.image.height}
                          sizes="80px"
                          className="size-20 shrink-0 object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <p className="text-[0.9375rem] font-medium leading-snug">{product.name}</p>
                            <p className="mt-0.5 text-[0.8125rem] text-graphite">
                              {categories.find((c) => c.id === product.category)?.label} · {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full bg-white">
                              <button
                                type="button"
                                onClick={() => setQty(id, qty - 1)}
                                aria-label={`Quitar una unidad de ${product.name}`}
                                className="press inline-flex size-11 items-center justify-center rounded-full hover:bg-line"
                              >
                                <Minus size={16} aria-hidden />
                              </button>
                              <span aria-live="polite" className="min-w-6 text-center text-sm font-medium">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(id, qty + 1)}
                                disabled={qty >= MAX_ITEM_QTY}
                                aria-label={`Agregar una unidad de ${product.name}`}
                                className="press inline-flex size-11 items-center justify-center rounded-full hover:bg-line disabled:opacity-40"
                              >
                                <Plus size={16} aria-hidden />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(id)}
                              className="press inline-flex h-11 items-center rounded-full px-3 text-sm text-graphite underline-offset-4 hover:text-ink hover:underline"
                            >
                              Quitar<span className="sr-only"> {product.name}</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 bg-paper px-5 py-5 md:px-6">
                    <div className="flex items-baseline justify-between">
                      <p className="text-base">
                        {count} {count === 1 ? "prenda" : "prendas"}
                      </p>
                      <p className="text-base font-medium">{total === null ? "Precios a consultar" : formatPrice(total)}</p>
                    </div>
                    <a
                      href={whatsappUrl(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-base font-medium text-white hover:bg-graphite"
                    >
                      <MessageCircle size={20} aria-hidden />
                      Consultar por WhatsApp
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                    <p className="text-[0.8125rem] leading-snug text-graphite">
                      Se abre WhatsApp con tu lista ya escrita. La compra se cierra por chat con la tienda; acá no se paga.
                    </p>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="press inline-flex h-11 items-center text-sm text-graphite underline-offset-4 hover:text-ink hover:underline"
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
