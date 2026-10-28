"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { categories, formatPrice, type Product } from "@/data/products";
import { addToCart, useShop } from "@/lib/shop-store";

/**
 * Tarjeta de prenda: foto, y debajo lo esencial siempre a la vista (nombre, categoría, precio)
 * con el botón para sumar la prenda al carrito. Nada se esconde detrás de hover o toque.
 */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { lines } = useShop();
  const qty = lines.find((l) => l.id === product.id)?.qty ?? 0;
  const category = categories.find((c) => c.id === product.category)?.label;

  return (
    <article className="group mb-8 break-inside-avoid md:mb-10">
      <div className="relative overflow-hidden bg-paper">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="h-auto w-full transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-balance text-[0.9375rem] font-medium leading-snug">{product.name}</h3>
          <p className="mt-0.5 text-[0.8125rem] text-graphite">
            {category} · {formatPrice(product.price)}
          </p>
          {product.sizes && product.sizes.length > 0 && (
            <p className="mt-0.5 text-[0.8125rem] text-graphite">Talles: {product.sizes.join(" · ")}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product.id)}
          aria-label={
            qty > 0
              ? `${product.name}: ${qty} en el carrito. Agregar otra`
              : `Agregar ${product.name} al carrito`
          }
          className={`press relative -mr-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full ${
            qty > 0 ? "bg-accent text-ink" : "bg-ink text-white hover:bg-graphite"
          }`}
        >
          {qty > 0 ? <Check size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
          {qty > 1 && (
            <span
              aria-hidden
              className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-ink text-[0.6875rem] font-semibold text-white"
            >
              {qty}
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
