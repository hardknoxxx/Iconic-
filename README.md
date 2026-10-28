# ICONIC — Landing page

Landing de ICONIC, tienda de ropa urbana unisex en Puerto Iguazú (Misiones, Argentina).
Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger + MorphSVG) · Framer Motion · Lenis · Lucide.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build && npm start
```

## Dónde editar cada cosa

| Qué | Archivo |
| --- | --- |
| Teléfonos, WhatsApp, Instagram, **Facebook**, dirección, medios de pago | `src/data/site.ts` |
| Prendas: nombre, **precio**, talles, descripción, fotos | `src/data/products.ts` |
| Mensajes de WhatsApp | `src/lib/whatsapp.ts` |
| Dominio real (metadatos / Open Graph) | `site.url` en `src/data/site.ts` |

- Para mostrar un precio: `price: 45000` en la prenda (se formatea en ARS). Con `null` muestra «Precio a consultar».
- Para activar Facebook: completar `social.facebook = { handle, url }` y el botón aparece solo en Contacto y Footer.
- Para agregar una prenda: copiar la foto a `public/images/products/` y sumar un objeto a `products`.
- Para sumar fotos de **Vestidos**: completar `image` de esa categoría (hoy es un bloque tipográfico que abre WhatsApp).

## Decisiones técnicas

- **Carrito → WhatsApp** (`src/lib/shop-store.ts`, `CartDrawer.tsx`): el botón + de cada prenda la suma al carrito (se guarda en el navegador); «Consultar por WhatsApp» abre el chat con un mensaje que lista todo lo del carrito (`cartMessage` en `src/lib/whatsapp.ts`). No hay pago ni inventario. Si una prenda tiene `price`, el carrito suma el total; si no, dice «Precios a consultar».
- **Buscador** del header: filtra la grilla por nombre o categoría (`src/lib/search.ts`).

- **Portada con scroll animado** (`src/components/HeroScene.tsx`): sección fijada con GSAP ScrollTrigger; una mancha se deforma con MorphSVG entre escenas y las prendas (recortes en `public/images/cutouts/`) entran por los costados. El color de acento (rosa arcilla) está en `--color-accent` (`globals.css`). Con movimiento reducido se muestra una versión estática.

- **Tarjetas de producto**: hover/foco en mouse (CSS), toque para abrir/cerrar en táctil; el botón de WhatsApp es independiente.
- **Lenis** corre sobre el scroll nativo, por eso convive con `whileInView`/`useScroll` de Framer Motion; se suaviza solo con rueda (no en táctil) y se desactiva con `prefers-reduced-motion`.
- `lucide-react` v1 no trae logos de marcas: Instagram y Facebook son SVG propios en `src/components/icons.tsx`.
