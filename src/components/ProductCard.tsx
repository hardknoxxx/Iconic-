"use client";

import Image from "next/image";
import { MessageCircle, Plus } from "lucide-react";
import { formatPrice, categories, type Product } from "@/data/products";
import { productMessage, whatsappUrl } from "@/lib/whatsapp";

type Props = {
  product: Product;
  open: boolean;
  onToggle: () => void;
  priority?: boolean;
};

/**
 * Tarjeta editorial: en reposo solo se ve la fotografía.
 * - Mouse: el panel aparece con hover o foco de teclado (CSS puro, sin JS).
 * - Táctil: un toque abre el panel, otro toque lo cierra (estado controlado por el padre).
 */
export function ProductCard({ product, open, onToggle, priority }: Props) {
  const category = categories.find((c) => c.id === product.category)?.label;

  const handleClick = () => {
    // Con mouse el panel ya responde a hover/foco; el toggle es solo para pantallas táctiles.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    onToggle();
  };

  return (
    <article
      data-card
      data-open={open}
      className="group relative mb-3 break-inside-avoid overflow-hidden bg-paper md:mb-5"
    >
      <Image
        src={product.image.src}
        alt={product.image.alt}
        width={product.image.width}
        height={product.image.height}
        priority={priority}
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="h-auto w-full transition-transform duration-[700ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.035] group-data-[open=true]:scale-[1.035] motion-reduce:transition-none"
      />

      <button
        type="button"
        onClick={handleClick}
        aria-expanded={open}
        aria-label={`${product.name}: ver detalles`}
        className="absolute inset-0 z-10 cursor-default focus-visible:outline-offset-[-3px]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 z-20 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-[opacity,transform] duration-300 ease-[var(--ease-out-strong)] group-hover:opacity-0 group-data-[open=true]:rotate-45 md:right-3 md:top-3"
      >
        <Plus size={16} />
      </span>

      <div
        className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex translate-y-3 items-end justify-between gap-2 bg-white p-2.5 opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out-strong)] group-has-[:focus-visible]:pointer-events-auto group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-data-[open=true]:pointer-events-auto group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none md:inset-x-3 md:bottom-3 md:block md:p-4"
      >
        <div className="min-w-0">
          <p className="hidden text-[0.65rem] font-medium uppercase tracking-[0.16em] text-graphite md:block">
            {category}
          </p>
          <h3 className="line-clamp-2 text-[0.7rem] font-semibold leading-snug text-ink md:mt-1 md:line-clamp-none md:text-base">{product.name}</h3>
          <p className="mt-0.5 text-[0.7rem] text-graphite md:mt-1 md:text-sm">{formatPrice(product.price)}</p>
          {product.sizes && product.sizes.length > 0 && (
            <p className="mt-1 text-xs text-graphite">Talles: {product.sizes.join(" · ")}</p>
          )}
          {product.description && (
            <p className="mt-2 hidden text-xs leading-relaxed text-graphite md:block">{product.description}</p>
          )}
        </div>
        <a
          href={whatsappUrl(productMessage(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar por ${product.name} por WhatsApp (se abre en una pestaña nueva)`}
          className="press inline-flex size-10 shrink-0 md:size-auto items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white hover:bg-graphite md:mt-3 md:h-10 md:w-full"
        >
          <MessageCircle size={18} aria-hidden />
          <span className="hidden md:inline">Consultar</span>
        </a>
      </div>
    </article>
  );
}
