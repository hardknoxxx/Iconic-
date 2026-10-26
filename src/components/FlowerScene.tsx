"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = {
  /** Se llama tras el primer cuadro dibujado, para encadenar el fundido de entrada. */
  onReady: () => void;
  /** Se llama si WebGL no está disponible o falla la inicialización. */
  onError: () => void;
};

/** Pétalo procedural: base angosta, punta redondeada y leve curvatura copada. */
function createPetalGeometry(length: number, width: number, cup: number, curl: number) {
  const geo = new THREE.PlaneGeometry(1, 1, 10, 22);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getY(i) + 0.5; // 0 base → 1 punta
    const v = pos.getX(i) * 2; // -1 → 1 a lo ancho
    const profile = Math.pow(Math.sin(Math.PI * Math.pow(Math.min(Math.max(u, 0.001), 0.999), 0.72)), 0.55);
    const w = width * profile;
    pos.setXYZ(i, v * w * 0.5, u * length, cup * v * v * w + curl * u * u * length);
  }
  geo.computeVertexNormals();
  return geo;
}

const PALETTE = {
  ink: 0x111111,
  graphite: 0x292929,
  mid: 0x858585,
  line: 0xe5e5e5,
  white: 0xffffff,
};

type Ring = {
  count: number;
  length: number;
  width: number;
  tilt: number;
  lift: number;
  cup: number;
  curl: number;
  color: number;
};

const RINGS: Ring[] = [
  { count: 6, length: 1.3, width: 1.0, tilt: 1.3, lift: 0.0, cup: 0.34, curl: 0.1, color: PALETTE.graphite },
  { count: 8, length: 1.18, width: 0.86, tilt: 1.05, lift: 0.03, cup: 0.38, curl: 0.16, color: PALETTE.white },
  { count: 8, length: 1.02, width: 0.74, tilt: 0.82, lift: 0.07, cup: 0.4, curl: 0.2, color: PALETTE.line },
  { count: 6, length: 0.84, width: 0.62, tilt: 0.58, lift: 0.11, cup: 0.42, curl: 0.22, color: PALETTE.ink },
  { count: 5, length: 0.6, width: 0.46, tilt: 0.3, lift: 0.15, cup: 0.45, curl: 0.2, color: PALETTE.white },
];

export default function FlowerScene({ onReady, onError }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      onError();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    const canvas = renderer.domElement;
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.45;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 8);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-3, 4, 5);
    const rim = new THREE.DirectionalLight(0xffffff, 1.3);
    rim.position.set(4, 1, -3);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const materialFor = new Map<number, THREE.MeshPhysicalMaterial>();
    const material = (color: number) => {
      let m = materialFor.get(color);
      if (!m) {
        m = new THREE.MeshPhysicalMaterial({
          color,
          roughness: color === PALETTE.ink ? 0.32 : 0.55,
          metalness: 0,
          clearcoat: color === PALETTE.ink ? 0.6 : 0.15,
          clearcoatRoughness: 0.4,
          side: THREE.DoubleSide,
        });
        materialFor.set(color, m);
        materials.push(m);
      }
      return m;
    };

    const flower = new THREE.Group();
    RINGS.forEach((ring, ringIndex) => {
      const geo = createPetalGeometry(ring.length, ring.width, ring.cup, ring.curl);
      geometries.push(geo);
      const mat = material(ring.color);
      for (let i = 0; i < ring.count; i++) {
        const pivot = new THREE.Object3D();
        pivot.position.y = ring.lift;
        pivot.rotation.y = (i / ring.count) * Math.PI * 2 + ringIndex * 0.55;
        const petal = new THREE.Mesh(geo, mat);
        petal.rotation.x = ring.tilt;
        pivot.add(petal);
        flower.add(pivot);
      }
    });

    // Centro: núcleo gris y estambres alternados en blanco y negro.
    const coreGeo = new THREE.SphereGeometry(0.13, 24, 16);
    const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.34, 6);
    const tipGeo = new THREE.SphereGeometry(0.03, 12, 10);
    geometries.push(coreGeo, stemGeo, tipGeo);
    const core = new THREE.Mesh(coreGeo, material(PALETTE.mid));
    core.position.y = 0.2;
    flower.add(core);
    for (let i = 0; i < 14; i++) {
      const color = i % 2 ? PALETTE.white : PALETTE.ink;
      const pivot = new THREE.Object3D();
      pivot.position.y = 0.2;
      pivot.rotation.y = (i / 14) * Math.PI * 2;
      const stem = new THREE.Mesh(stemGeo, material(PALETTE.mid));
      stem.position.y = 0.17;
      const tip = new THREE.Mesh(tipGeo, material(color));
      tip.position.y = 0.34;
      const arm = new THREE.Group();
      arm.rotation.x = 0.28 + (i % 3) * 0.08;
      arm.add(stem, tip);
      pivot.add(arm);
      flower.add(pivot);
    }

    flower.position.y = -0.55;
    const stage = new THREE.Group();
    stage.add(flower);
    stage.rotation.x = 0.95; // vista de tres cuartos desde arriba
    scene.add(stage);

    // --- Interacción: parallax suave con puntero o toque ---
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = ((e.clientX - (rect.left + rect.width / 2)) / Math.max(window.innerWidth, 1)) * 2;
      const ny = ((e.clientY - (rect.top + rect.height / 2)) / Math.max(window.innerHeight, 1)) * 2;
      target.x = THREE.MathUtils.clamp(nx, -1, 1);
      target.y = THREE.MathUtils.clamp(ny, -1, 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // --- Tamaño ---
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // --- Bucle: solo corre mientras es visible y la pestaña está activa ---
    const t0 = performance.now();
    let raf = 0;
    let visible = true;
    let ready = false;

    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      stage.rotation.x = 0.95 + current.y * 0.22;
      stage.rotation.z = -current.x * 0.12;
      flower.rotation.y = t * 0.12 + current.x * 0.5;
      const breathe = 1 + Math.sin(t * 0.8) * 0.012;
      flower.scale.setScalar(breathe);
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
      onError();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [onReady, onError]);

  return <div ref={hostRef} className="size-full" />;
}
