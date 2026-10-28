import type { SVGProps } from "react";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": true,
} as const;

/** Bolsa de compras, trazo fino y esquinas rectas como el resto de la interfaz. */
export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 8h15l-1 12.5h-13z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </svg>
  );
}

/** Bolsa con «+»: sumar la prenda al carrito. */
export function BagPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 8h15l-1 12.5h-13z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
      <path d="M12 12.5v5M9.5 15h5" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
