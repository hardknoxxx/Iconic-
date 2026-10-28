"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useRef } from "react";

const VERT = `attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}`;

/* Ondas que nacen bajo el cursor y se apagan con la distancia; el puntero arrastra un poco la imagen. */
const FRAG = `precision mediump float;
uniform sampler2D tex;uniform vec2 mouse;uniform float k;uniform float t;varying vec2 v;
void main(){
  vec2 d=v-mouse;float r=length(d);
  float wave=sin(r*34.-t*5.)*exp(-r*4.5)*k;
  vec2 uv=v+normalize(d+1e-4)*wave*0.018;
  uv=(uv-.5)/(1.+.035*k)+.5;
  gl_FragColor=texture2D(tex,clamp(uv,0.,1.));
}`;

/**
 * Foto con distorsión WebGL al pasar el cursor. El <img> sigue siendo el contenido real (SEO, sin JS,
 * táctil, movimiento reducido): el canvas solo se crea la primera vez que un puntero fino entra,
 * y se oculta cuando el efecto se apaga, para no mantener contextos ni frames de más.
 */
export function GlImage({ alt, ...props }: ImageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<null | {
    start: () => void;
    target: { x: number; y: number; k: number };
  }>(null);
  const failed = useRef(false);

  const init = useCallback(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const img = el?.querySelector("img");
    if (!el || !cv || !img || failed.current || state.current) return;
    const gl = cv.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) {
      failed.current = true;
      return;
    }
    const make = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, make(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, make(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      failed.current = true;
      return;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);

    const tex = gl.createTexture();
    const source = new window.Image();
    const cur = { x: 0.5, y: 0.5, k: 0 };
    const target = { x: 0.5, y: 0.5, k: 0 };
    let raf = 0;
    let ready = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(el.clientWidth * dpr);
      cv.height = Math.round(el.clientHeight * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
    };

    const frame = (now: number) => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      cur.k += (target.k - cur.k) * 0.1;
      gl.uniform2f(u("mouse"), cur.x, cur.y);
      gl.uniform1f(u("k"), cur.k);
      gl.uniform1f(u("t"), now / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (target.k === 0 && cur.k < 0.005) {
        cv.style.opacity = "0";
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!ready) return;
      cv.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(frame);
    };

    source.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      size();
      ready = true;
      if (target.k > 0) start();
    };
    source.src = img.currentSrc || img.src;

    new ResizeObserver(() => ready && size()).observe(el);
    state.current = { start, target };
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const enter = () => {
      if (!fine.matches || calm.matches) return;
      init();
      if (state.current) {
        state.current.target.k = 1;
        state.current.start();
      }
    };
    const move = (e: PointerEvent) => {
      const s = state.current;
      if (!s) return;
      const r = el.getBoundingClientRect();
      s.target.x = (e.clientX - r.left) / r.width;
      s.target.y = 1 - (e.clientY - r.top) / r.height;
    };
    const leave = () => {
      if (state.current) state.current.target.k = 0;
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [init]);

  return (
    <div ref={wrap} className="relative">
      <Image alt={alt} {...props} />
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}
