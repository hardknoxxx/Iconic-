"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const FlowerScene = dynamic(() => import("./FlowerScene"), { ssr: false });

/** Alternativa estática (sin WebGL, movimiento reducido o equipos de bajo rendimiento). */
function FlowerFallback() {
  const petals = [
    { n: 6, r: 0, rx: 15, ry: 46, cy: 52, fill: "#292929", rot: 0 },
    { n: 8, r: 0, rx: 13, ry: 38, cy: 46, fill: "#ffffff", rot: 22 },
    { n: 8, r: 0, rx: 11, ry: 30, cy: 40, fill: "#e5e5e5", rot: 11 },
    { n: 6, r: 0, rx: 9, ry: 22, cy: 32, fill: "#111111", rot: 30 },
    { n: 5, r: 0, rx: 7, ry: 14, cy: 22, fill: "#ffffff", rot: 8 },
  ];
  return (
    <svg viewBox="-100 -100 200 200" className="size-full" role="img" aria-label="Flor monocromática, símbolo de ICONIC">
      {petals.map((p, k) => (
        <g key={k}>
          {Array.from({ length: p.n }).map((_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy={-p.cy}
              rx={p.rx}
              ry={p.ry}
              fill={p.fill}
              stroke="#858585"
              strokeOpacity="0.35"
              strokeWidth="0.6"
              transform={`rotate(${p.rot + (360 / p.n) * i})`}
            />
          ))}
        </g>
      ))}
      <circle r="6" fill="#858585" />
    </svg>
  );
}

/**
 * Flor 3D con carga diferida: el bundle de Three.js solo se descarga cuando el bloque
 * está por entrar en pantalla. Debajo siempre hay una versión estática que se desvanece
 * cuando el primer cuadro 3D ya está dibujado.
 * `className` debe posicionar el bloque (absolute/relative) y darle tamaño.
 */
export function Flower({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion() === true;
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Equipos de bajo rendimiento o sin WebGL se quedan con la versión estática.
        const nav = navigator as Navigator & { deviceMemory?: number };
        const weak = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
        const probe = document.createElement("canvas");
        const hasGL = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
        setLowPower(weak || !hasGL);
        setNear(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  const use3D = near && !reduce && !failed && !lowPower;

  return (
    <div ref={hostRef} className={className}>
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: use3D && ready ? 0 : 1 }}
      >
        <FlowerFallback />
      </div>
      {use3D && (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <FlowerScene onReady={onReady} onError={onError} />
        </div>
      )}
    </div>
  );
}
