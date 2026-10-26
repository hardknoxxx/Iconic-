"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis hace scroll suave sobre el scroll nativo (no usa transforms), así que convive
 * con whileInView / useScroll de Framer Motion sin trabajo extra.
 * Con movimiento reducido se desactiva el suavizado; en táctil Lenis deja el scroll nativo.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() === true;

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{ autoRaf: true, duration: 1.1, smoothWheel: !reduce, anchors: false }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
