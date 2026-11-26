"use client";

import { useEffect, useRef } from "react";

/**
 * Page-wide pixel starfield matching the hero banner. Stars sit still and dim;
 * only the ones near the cursor light up, then fade back once it moves away.
 */

const PIXEL = 2; // css px per canvas px
const RADIUS = 140; // glow radius around the cursor (css px)
const STAR = {
  dark: [[34, 34, 38], [64, 64, 68], [138, 138, 144], [236, 236, 240]],
  light: [[238, 238, 240], [224, 224, 226], [198, 198, 202], [160, 160, 166]],
};

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function StarfieldBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let W = 0, H = 0, img: ImageData;
    // per star: x, y, base brightness, big
    let stars = new Float32Array(0);
    let glow = new Float32Array(0);
    let mx = -1e4, my = -1e4, raf = 0;

    function build() {
      W = Math.max(1, Math.round(window.innerWidth / PIXEL));
      H = Math.max(1, Math.round(window.innerHeight / PIXEL));
      canvas!.width = W;
      canvas!.height = H;
      img = ctx!.createImageData(W, H);
      const rand = rng(11);
      const count = Math.round((W * H) / 160);
      const list: number[] = [];
      for (let i = 0; i < count; i++) {
        list.push(Math.floor(rand() * W), Math.floor(rand() * H), Math.pow(rand(), 2.2), rand() < 0.07 ? 1 : 0);
      }
      stars = new Float32Array(list);
      glow = new Float32Array(count);
    }

    function put(d: Uint8ClampedArray, k: number, c: number[]) {
      d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
    }

    // returns true while some star is still fading
    function draw() {
      const dark = document.documentElement.classList.contains("theme-dark");
      const sp = dark ? STAR.dark : STAR.light;
      const d = img.data;
      d.fill(0);
      const r = RADIUS / PIXEL, cx = mx / PIXEL, cy = my / PIXEL;
      let busy = false;

      for (let s = 0, i = 0; s < stars.length; s += 4, i++) {
        const x = stars[s], y = stars[s + 1], base = stars[s + 2];
        const dist = Math.hypot(x - cx, y - cy);
        const target = dist < r ? Math.pow(1 - dist / r, 1.5) : 0;
        glow[i] += (target - glow[i]) * 0.18;
        if (Math.abs(target - glow[i]) > 0.01) busy = true;

        const b = base * (0.25 + 0.75 * glow[i]) + 0.45 * glow[i] * base;
        if (b < 0.04) continue;
        const k = (y * W + x) * 4;
        put(d, k, sp[b > 0.55 ? 3 : b > 0.3 ? 2 : b > 0.12 ? 1 : 0]);
        if (stars[s + 3] && glow[i] > 0.35 && b > 0.4 && x > 0 && x < W - 1 && y > 0 && y < H - 1) {
          put(d, k - 4, sp[1]); put(d, k + 4, sp[1]); put(d, k - W * 4, sp[1]); put(d, k + W * 4, sp[1]);
        }
      }
      ctx!.putImageData(img, 0, 0);
      return busy;
    }

    function loop() {
      raf = draw() ? requestAnimationFrame(loop) : 0;
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      kick();
    }

    function onLeave() {
      mx = my = -1e4;
      kick();
    }

    function onResize() {
      build();
      draw();
    }

    build();
    draw();
    const mo = new MutationObserver(() => draw()); // theme toggle
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
