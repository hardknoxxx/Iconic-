const words = ["ICONIC", "Ropa urbana", "Unisex", "Tops", "Pantalones", "Vestidos", "Noche"];

/**
 * Banda de texto de contorno a todo el ancho. El scroll la arrastra en horizontal (data-drag),
 * a contramano del titular de la portada. Es decorativa: se oculta a lectores de pantalla.
 */
export function Marquee() {
  return (
    <div aria-hidden className="overflow-hidden border-y border-ink py-3 md:py-5">
      <div
        data-drag="8,-38"
        className="t-display t-outline whitespace-nowrap text-[clamp(4rem,13vw,11rem)] leading-[0.95]"
      >
        {[...words, ...words].map((w, i) => (
          <span key={i} className="mr-[0.4em]">
            {w}
            <span className="ml-[0.4em] align-middle text-[0.35em]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
