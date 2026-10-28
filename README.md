# ICONIC — Landing page

Landing de ICONIC, tienda de ropa urbana unisex en Puerto Iguazú (Misiones, Argentina).
Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger) · Framer Motion · Lenis · WebGL propio. Tipografías: Barlow Condensed (titulares), Instrument Serif (textos de apertura) + Hanken Grotesk (interfaz). Paleta monocroma.

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
- Para activar Facebook: completar `social.facebook = { handle, url }` y el enlace aparece solo en Contacto.
- Para agregar una prenda: copiar la foto a `public/images/products/` y sumar un objeto a `products`.
- **Vestidos** hoy es una fila de texto que abre WhatsApp; para mostrarlos, agregar prendas con `category: "vestidos"` y un bloque en `Collection.tsx`.
- Fotos editoriales de portada y doble página: `editorial` en `src/data/products.ts`.

## Decisiones técnicas

- **Carrito → WhatsApp** (`src/lib/shop-store.ts`, `CartDrawer.tsx`): el enlace «Agregar +» de cada prenda la suma al carrito (se guarda en el navegador); «Consultar por WhatsApp» abre el chat con un mensaje que lista todo lo del carrito (`cartMessage` en `src/lib/whatsapp.ts`). No hay pago ni inventario. Si una prenda tiene `price`, el carrito suma el total; si no, dice «Precios a consultar».
- **Buscador** del header: filtra la grilla por nombre o categoría (`src/lib/search.ts`).

- **Diseño** (rediseño editorial monocromo): paleta fija `#FFFFFF #111111 #292929 #858585 #E5E5E5 #F7F7F7` en `globals.css` (sin acentos); clases `.t-display`, `.t-label`, `.tag`, `.btn`, `.link`. Header de tres zonas (`Header.tsx`), portada `Hero.tsx`, colección por categorías `Collection.tsx` + `ProductCard.tsx` (nada depende del hover), marca con Image accordion (`Brand.tsx`), contacto como tabla y footer solo con el logo.
- **Lenis** corre sobre el scroll nativo, por eso convive con `whileInView`/`useScroll` de Framer Motion; se suaviza solo con rueda (no en táctil) y se desactiva con `prefers-reduced-motion`.
- **Scroll con GSAP** (`GsapScroll.tsx`): `data-parallax="n"` desplaza un elemento ±n % mientras cruza la pantalla y `data-title` destapa los titulares con una máscara. Se desactiva con `prefers-reduced-motion`.
- **WebGL** (`GlImage.tsx`): las fotos de la portada se distorsionan con ondas bajo el cursor. El `<img>` sigue siendo el contenido; el canvas se crea recién al primer hover con puntero fino y se apaga solo.
- **Menú lateral** (escritorio y móvil, `Header.tsx`): seis franjas negras se extienden desde el borde izquierdo en escalones, de arriba hacia abajo, y al cerrar se recogen en orden inverso, de abajo hacia arriba (Framer Motion). Los enlaces suben con máscara.
- **Micro-interacciones**: relleno de izquierda a derecha en botones, subrayado que se dibuja, escala al tocar, zoom y fondo en las fichas, «Agregado» con check y rebote del contador del carrito.
