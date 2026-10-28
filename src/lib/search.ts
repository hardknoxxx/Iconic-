import { categories, type Product } from "@/data/products";

/** Sin acentos ni mayúsculas, para que «camuflado» encuentre «Camuflado» y «pantalon» encuentre «Pantalones». */
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Una prenda coincide si todas las palabras buscadas aparecen en su nombre o su categoría. */
export function matches(product: Product, query: string) {
  const haystack = fold(`${product.name} ${categories.find((c) => c.id === product.category)?.label ?? ""}`);
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}
