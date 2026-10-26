"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.23, 1, 0.32, 1] as const;

/** Entrada suave al hacer scroll: solo una vez, con desplazamiento corto. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "h2" | "h3";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </Tag>
  );
}
