"use client";

import { useEffect, useRef } from "react";

/**
 * Dithered Mars hanging from the top edge of the hero banner.
 * Software-rendered on a half-resolution canvas: each pixel is ray-mapped onto a
 * sphere, shaded, then ordered-dithered (4x4 Bayer) into a 4-tone rust palette.
 */

export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const PALETTE = {
  dark: [[46, 18, 11], [116, 50, 29], [182, 94, 54], [236, 182, 138]],
  light: [[98, 41, 23], [160, 72, 41], [206, 118, 74], [228, 172, 128]],
};
const PIXEL = 2; // css px per canvas px
const TILT = 0.38; // axial tilt (rad)
const SPIN = 5e-5; // rad per ms
const FRAME_MS = 80;
const LIGHT = [0.5, 0.6, 0.62];

export default function MarsBanner() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0, H = 0, img: ImageData;
    // per-pixel data that never changes between frames
    let idx = new Uint32Array(0), sinLa = new Float32Array(0), cosLa = new Float32Array(0);
    let sinLo = new Float32Array(0), cosLo = new Float32Array(0);
    let lit = new Float32Array(0), limb = new Float32Array(0), dith = new Float32Array(0);
    let n = 0, elapsed = 0, last = 0, raf = 0, visible = false;

    function build() {
      const r = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width / PIXEL));
      H = Math.max(1, Math.round(r.height / PIXEL));
      canvas!.width = W;
      canvas!.height = H;
      img = ctx!.createImageData(W, H);

      const R = 0.55 * W; // sphere radius
      const cy = 0.82 * H - R; // centre sits above the banner, so only the lower limb shows
      const [sT, cT] = [Math.sin(TILT), Math.cos(TILT)];
      const len = Math.hypot(...LIGHT);
      const size = W * H;
      idx = new Uint32Array(size); sinLa = new Float32Array(size); cosLa = new Float32Array(size);
      sinLo = new Float32Array(size); cosLo = new Float32Array(size);
      lit = new Float32Array(size); limb = new Float32Array(size); dith = new Float32Array(size);
      n = 0;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const X = (x + 0.5 - W / 2) / R;
          const Y = (y + 0.5 - cy) / R;
          const r2 = X * X + Y * Y;
          if (r2 >= 1) continue;
          const Z = Math.sqrt(1 - r2);
          const yy = Y * cT + Z * sT;
          const zz = -Y * sT + Z * cT;
          const la = Math.asin(Math.max(-1, Math.min(1, yy)));
          const lo = Math.atan2(X, zz);
          sinLa[n] = Math.sin(la); cosLa[n] = Math.cos(la);
          sinLo[n] = Math.sin(lo); cosLo[n] = Math.cos(lo);
          lit[n] = Math.max(0, Math.min(1, ((X * LIGHT[0] + Y * LIGHT[1] + Z * LIGHT[2]) / len) * 1.35 - 0.08));
          limb[n] = Math.min(1, 3.5 * Z);
          dith[n] = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
          idx[n++] = (y * W + x) * 4;
        }
      }
    }

    function draw() {
      const pal = document.documentElement.classList.contains("theme-dark") ? PALETTE.dark : PALETTE.light;
      const d = img.data;
      d.fill(0);
      const spin = elapsed * SPIN;
      const [sn, cs] = [Math.sin(spin), Math.cos(spin)];

      for (let i = 0; i < n; i++) {
        // point on the (rotating) unit sphere
        const y = sinLa[i];
        const x = cosLa[i] * (sinLo[i] * cs + cosLo[i] * sn);
        const z = cosLa[i] * (cosLo[i] * cs - sinLo[i] * sn);

        const warp = Math.sin(4 * x + 2 * y);
        const albedo =
          (Math.sin(5 * x + 2 * warp + 1.3) + Math.sin(6 * y - 4 * z + 2 * warp) +
            0.6 * Math.sin(12 * z + 9 * x + 3 * warp) + 0.35 * Math.sin(23 * x - 17 * y + 5 * z)) / 2.95;
        const ice = y > 0.98;
        const crater = Math.sin(19 * x + 7) * Math.sin(21 * y + 3) * Math.sin(17 * z + 5) > 0.82;

        const b = Math.max(0, Math.min(0.99, ice ? lit[i] * 0.9 + 0.1 : lit[i] * (0.8 + 0.3 * albedo) + (crater ? 0.1 : 0)));
        if (dith[i] > limb[i] * Math.min(1, 0.42 + 0.8 * b)) continue;

        const m = Math.floor(3.4 * b + dith[i]);
        const c = pal[ice || (m >= 3 && b > 0.85) ? 3 : Math.min(2, m)];
        const k = idx[i];
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
      ctx!.putImageData(img, 0, 0);
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (t - last < FRAME_MS) return;
      elapsed += Math.min(t - last, 100);
      last = t;
      draw();
    }

    function sync() {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden && !still.matches) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else draw();
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
    const ro = new ResizeObserver(() => { build(); draw(); });
    const mo = new MutationObserver(draw); // theme toggle
    io.observe(canvas);
    ro.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
