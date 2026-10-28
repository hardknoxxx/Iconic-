---
target: landing ICONIC vs referencia Serotoninn
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "url:https://iconic-hardknoxxx.vercel.app/"
timestamp: 2026-10-28T12-57-24Z
slug: iconic-hardknoxxx-vercel-app
---
# Crítica de ICONIC (https://iconic-hardknoxxx.vercel.app)
Método: dual-agent (A: revisión de diseño · B: detector y navegador). Referencia: Serotoninn (no accesible por antibots; solo datos verificados de Awwwards y reseñas).

Design Health Score: 21/32 aplicables (66 %, Bueno). Heurísticas 7 y 10 = n/a (landing de tipo Persuade, 8 prendas, sin carrito).
Notas: H1=2, H2=3, H3=2, H4=3, H5=3, H6=2, H8=3, H9=3.

Veredicto de especificidad: mayormente propio (pareja Archivo pesado + Bodoni cursiva, estrella del logo, recortes sobre mancha, footer de logo), con capas genéricas (píldoras, chips, tarjeta de hover, masonry, tarjetas de valores). La mitad streetwear es floja.

Problemas prioritarios
- [P1] Identidad del producto oculta en reposo; la tarjeta tapa la prenda; 8 enlaces Consultar de 40x40 px. Fix: leyenda mínima visible (categoría + Consultar), objetivos de 44 px. Comando: layout.
- [P1] Portada fijada de 3,4-3,8 pantallas sin pista ni salida; LCP 2,9 s a CPU 4x; 3 fuentes (171 KB). Fix: ~2,4 pantallas, "Seguí bajando", aligerar fuentes. Comandos: animate, optimize.
- [P2] Tarjetas De día/De calle/De noche con visibility hidden (inaccesibles a lector de pantalla); ~8,5 % del texto oculto tras scrollear en 390. Fix: texto equivalente accesible. Comando: harden.
- [P2] Categorías duplican los filtros y llegan después de la grilla; Vestidos es un enlace a WhatsApp con el mismo aspecto. Fix: una fuente de filtro, tiles antes de la grilla, Vestidos diferenciado. Comandos: layout, clarify.
- [P3] Header sin sección activa, gris plano sobre secciones oscuras, sin búsqueda, enlaces de 34-36 px; el rosa solo en la portada. Comandos: colorize, bolder.

Falsos positivos del detector: no-title, blank-gap 1440, long-pin, pinned-over-picture, first-action. Reales/parciales: statement-length (párrafo de marca 4 líneas), off-centre 768, tamaños táctiles. Intencionales: 3 tipografías, 12 tamaños, cursiva serif en títulos, sin video.

Contra Serotoninn (solo verificable): menú con imagen/video por categoría, filtro por categoría, video de campaña, slider de más vendidos, sección Who we are, footer diseñado, precarga y 404, paleta rojo #ED3833 + negro, tipografía brutalista.

Preguntas: portada 40 % más corta; rosa de marca o solo de portada; una imagen 3x más grande; horarios y foto del local.
