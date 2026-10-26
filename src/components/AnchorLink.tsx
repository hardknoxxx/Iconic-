"use client";

import type { ReactNode } from "react";
import { useAnchorScroll } from "@/lib/useAnchorScroll";

/** Enlace a un ancla interna con scroll suave (Lenis) y fallback nativo. */
export function AnchorLink({
  href,
  className,
  children,
}: {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
}) {
  const { onAnchorClick } = useAnchorScroll();
  return (
    <a href={href} onClick={onAnchorClick} className={className}>
      {children}
    </a>
  );
}
