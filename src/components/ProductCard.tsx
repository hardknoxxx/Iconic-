"use client";

import Image from "next/image";
import { categories, formatPrice, type Product } from "@/data/products";
import { addToCart, useShop } from "@/lib/shop-store";

/**
 * Ficha de prenda: imagen sobre fondo gris claro y debajo, en tipografía chica,
 * nombre, categoría y precio. Todo visible siempre (nada depende del hover);
 * el único gesto es «Agregar +», un enlace de texto.
 */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { lines } = useShop();
  const qty = lines.find((l) => l.id === product.id)?.qty ?? 0;
  const category = categories.find((c) => c.id === product.category)?.label;
  const contain = product.image.fit === "contain";

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          style={{ objectPosition: product.image.position }}
          className={`transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.03] motion-reduce:transition-none ${
            contain ? "object-contain p-3 md:p-5" : "object-cover"
          }`}
        />
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="t-label text-balance">{product.name}</h3>
          <p className="t-label mt-1 text-mid">
            {category} — {formatPrice(product.price)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => addToCart(product.id)}
        aria-label={
          qty > 0 ? `${product.name}: ${qty} en el carrito. Agregar otra` : `Agregar ${product.name} al carrito`
        }
        className="t-label mt-1 inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline"
      >
        {qty > 0 ? `En carrito (${qty}) +` : "Agregar +"}
      </button>
    </article>
  );
}
