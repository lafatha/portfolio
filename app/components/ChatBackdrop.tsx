"use client";

import { useEffect, useRef } from "react";
import { BAYER } from "./MarsBanner";

/**
 * Faint dithered black hole + pixel starfield behind the chat panel, in the
 * same ordered-dither style as the Mars banner. The accretion disk is a tilted
 * thin ellipse (near side in front of the shadow, far side lensed into a halo
 * around it) whose streaks orbit slowly, faster near the centre.
 */

const PIXEL = 3; // css px per canvas px (chunky dither)
const FRAME_MS = 40;
const TILT = -0.16; // disk axis angle (rad), rising slightly to the right
const SQUASH = 0.15; // disk thickness as seen edge-on
const DISK_IN = 1.25, DISK_OUT = 5.5; // in shadow radii
const GLOW = 0.62; // keeps the disk and halo subdued next to the shadow

// monochrome ramps, faint -> brightest glow. On white the glow is drawn in ink instead of light.
const TONES = {
  dark: [
    [34, 34, 36], [58, 58, 62], [88, 88, 93], [120, 120, 126],
    [152, 152, 158], [186, 186, 191], [218, 218, 222], [246, 246, 248],
  ],
  light: [
    [232, 232, 234], [214, 214, 218], [192, 192, 197], [168, 168, 174],
    [142, 142, 148], [114, 114, 120], [86, 86, 91], [58, 58, 62],
  ],
};

// orbit-streak texture in polar space (angle x radius), built once; frames only sample it
const TA = 512, TR = 256;
let streaks: Float32Array | null = null;
function buildStreaks() {
  const t = new Float32Array(TA * TR);
  for (let r = 0; r < TR; r++) {
    const rad = 1 + (r / TR) * (DISK_OUT - 1);
    for (let a = 0; a < TA; a++) {
      const ang = (a / TA) * Math.PI * 2;
      const c = Math.cos(ang), s = Math.sin(ang);
      // low frequency along the orbit, high across it -> long concentric streaks
      t[r * TA + a] = 0.5 * noise(c * 2 + 10, s * 2, rad * 7) + 0.5 * noise(c * 4, s * 4 + 4, rad * 19);
    }
  }
  return t;
}
const STAR = {
  dark: [[64, 64, 68], [138, 138, 144], [236, 236, 240]],
  light: [[224, 224, 226], [198, 198, 202], [160, 160, 166]],
};

function hash(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  return l(
    l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
    l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v),
    w,
  );
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ChatBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0, H = 0, img: ImageData;
    // glowing pixels: buffer offset, base angle, angular speed, base brightness, dither
    let gIdx = new Uint32Array(0), gPhi = new Float32Array(0);
    let gSpin = new Float32Array(0), gBase = new Float32Array(0), gDith = new Float32Array(0);
    let gRi = new Uint32Array(0);
    const tex = (streaks ??= buildStreaks());
    let stars = new Float32Array(0);
    let n = 0, elapsed = 0, last = 0, raf = 0;

    function build() {
      const r = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width / PIXEL));
      H = Math.max(1, Math.round(r.height / PIXEL));
      canvas!.width = W;
      canvas!.height = H;
      img = ctx!.createImageData(W, H);

      // big shadow pushed off the right edge, disk sweeping out to the left
      const R = Math.min(W * 0.36, H * 0.17); // shadow radius
      const cx = W * 0.74, cy = H * 0.27;
      const ca = Math.cos(TILT), sa = Math.sin(TILT);
      const size = W * H;
      gIdx = new Uint32Array(size); gPhi = new Float32Array(size);
      gSpin = new Float32Array(size); gBase = new Float32Array(size); gDith = new Float32Array(size);
      gRi = new Uint32Array(size);
      const blocked = new Uint8Array(size); // no stars here
      n = 0;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const px = (x + 0.5 - cx) / R, py = (y + 0.5 - cy) / R;
          const u = px * ca + py * sa; // along the disk
          const v = -px * sa + py * ca; // across the disk (positive = near side)
          const rr = Math.hypot(px, py);
          const dd = Math.hypot(u, v / SQUASH);
          const inDisk = dd > DISK_IN * 0.9 && dd < DISK_OUT;

          const front = inDisk && v > 0; // near half of the disk crosses in front of the shadow
          if (rr < 1 && !front) { blocked[y * W + x] = 1; continue; }

          // accretion disk: soft inner edge, long fade outward, approaching side (left) beamed brighter
          let disk = 0;
          if (inDisk) {
            const edge = Math.min(1, (dd - DISK_IN * 0.9) / 0.3);
            const fade = Math.pow(DISK_IN / Math.max(dd, DISK_IN), 1.35) * Math.min(1, (DISK_OUT - dd) / 1.5);
            const beam = 1 + 0.5 * (-u / dd);
            disk = edge * fade * beam * (front ? 1 : 0.45);
          }

          // far side of the disk lensed into a thick arc over the top (thinner underneath), plus the photon ring
          let halo = 0;
          if (rr > 1) {
            const thick = v < 0 ? 0.9 : 0.38;
            const t = (rr - 1) / thick;
            if (t < 1) {
              const side = 0.55 + 0.45 * (-u / rr);
              const vert = 0.4 + 0.6 * Math.abs(v) / rr;
              halo = Math.pow(1 - t, 1.3) * Math.max(side, vert) * (v < 0 ? 1 : 0.7);
            }
            halo = Math.max(halo, Math.max(0, 1 - Math.abs(rr - 1.03) / 0.04));
          }

          const useDisk = disk >= halo;
          const b = useDisk ? disk : halo;
          const rad = useDisk ? dd : DISK_IN + (rr - 1) * 2.5;
          const phi = useDisk ? Math.atan2(v / SQUASH, u) : Math.atan2(v, u);
          if (rr < 1.15 || b > 0.08) blocked[y * W + x] = 1;
          if (b < 0.02) continue;

          gIdx[n] = (y * W + x) * 4;
          gRi[n] = Math.min(TR - 1, Math.max(0, Math.floor(((rad - 1) / (DISK_OUT - 1)) * TR))) * TA;
          gPhi[n] = phi;
          gSpin[n] = 0.0011 / Math.pow(rad, 1.5);
          gBase[n] = Math.min(1, b) * GLOW;
          gDith[n++] = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
        }
      }

      // starfield: x, y, brightness, twinkle phase, twinkle speed, big
      const rand = rng(5);
      const list: number[] = [];
      const count = Math.round((W * H * PIXEL * PIXEL) / 640); // same density as the banner
      for (let i = 0; i < count; i++) {
        const sx = Math.floor(rand() * W), sy = Math.floor(rand() * H);
        const b = Math.pow(rand(), 2.2), big = rand() < 0.07 ? 1 : 0;
        if (blocked[sy * W + sx]) continue;
        list.push(sx, sy, b, rand() * 6.283, 0.00015 + rand() * 0.00035, big);
      }
      stars = new Float32Array(list);
    }

    function put(d: Uint8ClampedArray, k: number, c: number[]) {
      d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
    }

    function draw() {
      const dark = document.documentElement.classList.contains("theme-dark");
      const d = img.data;
      d.fill(0);

      const sp = dark ? STAR.dark : STAR.light;
      for (let s = 0; s < stars.length; s += 6) {
        const b = stars[s + 2] * (0.6 + 0.4 * Math.sin(elapsed * stars[s + 4] + stars[s + 3]));
        if (b < 0.1) continue;
        const x = stars[s], y = stars[s + 1];
        const k = (y * W + x) * 4;
        put(d, k, sp[b > 0.55 ? 2 : b > 0.28 ? 1 : 0]);
        if (stars[s + 5] && b > 0.45 && x > 0 && x < W - 1 && y > 0 && y < H - 1) {
          put(d, k - 4, sp[0]); put(d, k + 4, sp[0]); put(d, k - W * 4, sp[0]); put(d, k + W * 4, sp[0]);
        }
      }

      const tones = dark ? TONES.dark : TONES.light;
      const TAU = Math.PI * 2;
      for (let i = 0; i < n; i++) {
        // orbiting streaks: rotate each pixel's angle, faster near the centre, then sample the texture
        let f = (gPhi[i] - elapsed * gSpin[i]) / TAU;
        f -= Math.floor(f);
        const b = gBase[i] * (0.25 + 1.2 * tex[gRi[i] + Math.floor(f * TA)]);
        const t = Math.floor(b * 7.6 + gDith[i]);
        if (t <= 0) continue;
        put(d, gIdx[i], tones[Math.min(7, t)]);
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
      if (!document.hidden && !still.matches) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else draw();
    }

    const ro = new ResizeObserver(() => { build(); draw(); });
    const mo = new MutationObserver(draw); // theme toggle
    ro.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
    build();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none opacity-60 dark:opacity-55"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
