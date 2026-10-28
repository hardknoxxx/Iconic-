"use client";

import { useSyncExternalStore } from "react";
import { products } from "@/data/products";

/**
 * Estado de la tienda: carrito, buscador y avisos. Un store mínimo (sin dependencias) leído con
 * useSyncExternalStore, así el carrito se restaura de localStorage sin errores de hidratación.
 * No hay pago ni inventario: el carrito solo arma la consulta que se envía por WhatsApp.
 */

export type CartLine = { id: string; qty: number };

type ShopState = {
  lines: CartLine[];
  cartOpen: boolean;
  searchOpen: boolean;
  query: string;
  /** Último aviso para lectores de pantalla («Agregaste …»). */
  announcement: string;
};

const STORAGE_KEY = "iconic-cart-v1";
const MAX_QTY = 9;
const known = new Set(products.map((p) => p.id));

const initial: ShopState = { lines: [], cartOpen: false, searchOpen: false, query: "", announcement: "" };
let state: ShopState = initial;
let hydrated = false;
const listeners = new Set<() => void>();

/** Lo guardado en el navegador es entrada no confiable: solo se aceptan prendas conocidas y cantidades válidas. */
function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const lines: CartLine[] = [];
    for (const item of parsed) {
      if (typeof item !== "object" || item === null) continue;
      const { id, qty } = item as Record<string, unknown>;
      if (typeof id !== "string" || !known.has(id) || typeof qty !== "number") continue;
      if (lines.some((l) => l.id === id)) continue;
      lines.push({ id, qty: Math.min(MAX_QTY, Math.max(1, Math.round(qty))) });
    }
    return lines;
  } catch {
    return [];
  }
}

function writeStorage(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* sin almacenamiento (modo privado, bloqueado): el carrito sigue funcionando en memoria */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function set(partial: Partial<ShopState>) {
  state = { ...state, ...partial };
  if (partial.lines) writeStorage(partial.lines);
  emit();
}

function subscribe(listener: () => void) {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    const lines = readStorage();
    if (lines.length) state = { ...state, lines };
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => initial;

export function useShop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const nameOf = (id: string) => products.find((p) => p.id === id)?.name ?? "la prenda";

export function addToCart(id: string) {
  if (!known.has(id)) return;
  const existing = state.lines.find((l) => l.id === id);
  const lines = existing
    ? state.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l))
    : [...state.lines, { id, qty: 1 }];
  set({ lines, announcement: `Agregaste ${nameOf(id)} al carrito.` });
}

export function setQty(id: string, qty: number) {
  if (qty < 1) return removeFromCart(id);
  set({ lines: state.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)) });
}

export function removeFromCart(id: string) {
  set({ lines: state.lines.filter((l) => l.id !== id), announcement: `Quitaste ${nameOf(id)} del carrito.` });
}

export function clearCart() {
  set({ lines: [], announcement: "Vaciaste el carrito." });
}

export const openCart = () => set({ cartOpen: true, searchOpen: false });
export const closeCart = () => set({ cartOpen: false });
export const openSearch = () => set({ searchOpen: true, cartOpen: false });
export const closeSearch = () => set({ searchOpen: false });
export const setQuery = (query: string) => set({ query });

export const MAX_ITEM_QTY = MAX_QTY;
