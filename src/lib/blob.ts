/** Mancha orgánica cerrada: puntos radiales unidos con curvas suaves (Catmull-Rom → Bézier). */
export function blobPath(radii: number[], rotation = 0) {
  const n = radii.length;
  const pts = radii.map((r, i) => {
    const a = (i / n) * Math.PI * 2 + rotation;
    return [Math.cos(a) * r, Math.sin(a) * r] as const;
  });
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

/** Formas de la mancha en cada escena. Mismo número de puntos para que el morph sea limpio. */
export const blobShapes = {
  cover: blobPath([500, 510, 495, 505, 500, 512, 498, 507]),
  dia: blobPath([330, 430, 300, 410, 340, 450, 310, 400]),
  calle: blobPath([410, 300, 440, 330, 420, 290, 450, 320]),
  noche: blobPath([300, 440, 360, 310, 460, 330, 300, 430]),
};
