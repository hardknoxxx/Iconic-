/** Estrella de cuatro puntas del logo de ICONIC (la que reemplaza a la «o»). */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <path
        d="M50 0C53 31 69 47 100 50C69 53 53 69 50 100C47 69 31 53 0 50C31 47 47 31 50 0Z"
        fill="#111111"
        stroke="#f7f7f7"
        strokeWidth="3"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
    </svg>
  );
}
