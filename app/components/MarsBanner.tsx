"use client";

import { useEffect, useRef } from "react";

/**
 * Dithered Mars hanging from the top edge of the hero banner, over a pixel starfield.
 * A procedural surface texture (terrain, dark plains, craters, a canyon, polar caps) is
 * generated once; each frame the visible half-resolution pixels sample it with a spin
 * offset, are shaded, then ordered-dithered (4x4 Bayer) into an 8-tone rust ramp.
 */

export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// shadow -> highlight
const TONES = [
  [26, 11, 8], [54, 21, 13], [88, 33, 18], [126, 49, 26],
  [166, 71, 37], [202, 102, 58], [228, 144, 94], [244, 190, 148],
];
const ICE = [[150, 138, 134], [214, 205, 198], [247, 243, 237]];
const STAR = {
  dark: [[64, 64, 68], [138, 138, 144], [236, 236, 240]],
  light: [[224, 224, 226], [198, 198, 202], [160, 160, 166]],
};
const PIXEL = 2; // css px per canvas px
const TILT = 0.38; // axial tilt (rad)
const SPIN = 5e-5; // rad per ms
const FRAME_MS = 80;
const LIGHT = [0.5, 0.6, 0.62];
const TW = 384, TH = 192; // surface texture (equirectangular)

/* ---------- procedural surface, built once per page load ---------- */

let surface: { tone: Float32Array; ice: Uint8Array } | null = null;

function rng(seed: number) {
  // mulberry32
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

function fbm(x: number, y: number, z: number, octaves: number) {
  let sum = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * f, y * f, z * f);
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  return sum / norm;
}

function buildSurface() {
  const rand = rng(7);
  const craters: number[] = []; // x, y, z, radius (chord length)
  for (let i = 0; i < 110; i++) {
    const cz = rand() * 2 - 1, a = rand() * Math.PI * 2, s = Math.sqrt(1 - cz * cz);
    craters.push(s * Math.cos(a), cz, s * Math.sin(a), 0.02 + Math.pow(rand(), 3) * 0.13);
  }

  const size = TW * TH;
  const height = new Float32Array(size), albedo = new Float32Array(size), ice = new Uint8Array(size);
  for (let v = 0; v < TH; v++) {
    const lat = (0.5 - (v + 0.5) / TH) * Math.PI;
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let u = 0; u < TW; u++) {
      const lon = ((u + 0.5) / TW) * Math.PI * 2;
      const px = cl * Math.cos(lon), py = sl, pz = cl * Math.sin(lon);
      let h = fbm(px * 2.4 + 11, py * 2.4, pz * 2.4, 4);
      const plains = fbm(px * 1.2, py * 1.2 + 5, pz * 1.2, 3);
      let a = 0.68 + 0.3 * (h - 0.5) - 0.3 * Math.max(0, Math.min(1, (0.5 - plains) / 0.14));

      for (let c = 0; c < craters.length; c += 4) {
        const dx = px - craters[c], dy = py - craters[c + 1], dz = pz - craters[c + 2];
        const r = craters[c + 3];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > r * r * 1.7) continue;
        const t = Math.sqrt(d2) / r;
        if (t < 1) { h -= 0.22 * (1 - t * t); a -= 0.07 * (1 - t); }
        else { const rim = 1 - Math.abs(t - 1.1) / 0.2; if (rim > 0) { h += 0.1 * rim; a += 0.06 * rim; } }
      }

      // a long Valles Marineris-style canyon just off the equator
      const canyon = 1 - Math.abs(lat - (-0.1 + 0.04 * Math.sin(5 * lon))) / 0.03;
      if (lon > 0.9 && lon < 2.4 && canyon > 0) { h -= 0.3 * canyon; a -= 0.22 * canyon; }

      const i = v * TW + u;
      if (Math.abs(lat) > 1.37 + 0.1 * (fbm(px * 4, py * 4, pz * 4, 2) - 0.5)) ice[i] = 1;
      height[i] = h;
      albedo[i] = a;
    }
  }

  // bake relief: slopes facing the light (screen right/down) are brighter
  const tone = new Float32Array(size);
  for (let v = 0; v < TH; v++) {
    for (let u = 0; u < TW; u++) {
      const i = v * TW + u;
      const east = height[v * TW + ((u + TW - 1) % TW)] - height[v * TW + ((u + 1) % TW)];
      const south = height[Math.min(TH - 1, v + 1) * TW + u] - height[Math.max(0, v - 1) * TW + u];
      tone[i] = Math.max(0.05, Math.min(1, albedo[i] + 5 * (east * 0.5 + south * 0.6)));
    }
  }
  return { tone, ice };
}

/* ---------- component ---------- */

export default function MarsBanner() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { tone, ice } = (surface ??= buildSurface());

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0, H = 0, img: ImageData;
    // per-pixel data that never changes between frames
    let idx = new Uint32Array(0), row = new Uint32Array(0), col0 = new Float32Array(0);
    let lit = new Float32Array(0), limb = new Float32Array(0), dith = new Float32Array(0);
    let haze = new Float32Array(0), hazeIdx = new Uint32Array(0), stars = new Float32Array(0);
    let n = 0, nh = 0, elapsed = 0, last = 0, raf = 0, visible = false;

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
      idx = new Uint32Array(size); row = new Uint32Array(size); col0 = new Float32Array(size);
      lit = new Float32Array(size); limb = new Float32Array(size); dith = new Float32Array(size);
      haze = new Float32Array(size); hazeIdx = new Uint32Array(size);
      n = 0; nh = 0;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const X = (x + 0.5 - W / 2) / R;
          const Y = (y + 0.5 - cy) / R;
          const r2 = X * X + Y * Y;
          const bayer = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
          if (r2 >= 1) {
            // thin atmospheric haze hugging the lit limb
            const d = Math.sqrt(r2);
            if (d < 1.05) {
              const edgeLit = Math.max(0, (X * LIGHT[0] + Y * LIGHT[1]) / d / len);
              const s = (1 - (d - 1) / 0.05) * edgeLit * 0.6;
              if (bayer < s) { haze[nh] = s; hazeIdx[nh++] = (y * W + x) * 4; }
            }
            continue;
          }
          const Z = Math.sqrt(1 - r2);
          const yy = Y * cT + Z * sT;
          const zz = -Y * sT + Z * cT;
          const la = Math.asin(Math.max(-1, Math.min(1, yy)));
          const lo = Math.atan2(X, zz);
          row[n] = Math.min(TH - 1, Math.floor((0.5 - la / Math.PI) * TH)) * TW;
          col0[n] = ((lo / (Math.PI * 2) + 1) % 1) * TW;
          lit[n] = Math.max(0, Math.min(1, ((X * LIGHT[0] + Y * LIGHT[1] + Z * LIGHT[2]) / len) * 1.25 + 0.02));
          limb[n] = Math.min(1, 6 * Z);
          dith[n] = bayer;
          idx[n++] = (y * W + x) * 4;
        }
      }

      // starfield: x, y, brightness, twinkle phase, twinkle speed, big
      const rand = rng(3);
      const list: number[] = [];
      const count = Math.round((W * H) / 160);
      for (let i = 0; i < count; i++) {
        const sx = Math.floor(rand() * W), sy = Math.floor(rand() * H);
        const X = (sx + 0.5 - W / 2) / R, Y = (sy + 0.5 - cy) / R;
        const b = Math.pow(rand(), 2.2), big = rand() < 0.07 ? 1 : 0;
        if (X * X + Y * Y < 1.12) continue;
        list.push(sx, sy, b, rand() * 6.283, 0.0008 + rand() * 0.002, big);
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

      // stars
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

      // atmosphere (dark mode only: on white it reads as noise)
      if (dark) for (let i = 0; i < nh; i++) put(d, hazeIdx[i], TONES[haze[i] > 0.3 ? 4 : 3]);

      // planet
      const shift = ((elapsed * SPIN) / (Math.PI * 2)) * TW;
      for (let i = 0; i < n; i++) {
        const t = row[i] + (Math.floor(col0[i] + shift) % TW);
        const w = dith[i];
        if (w > limb[i]) continue; // dithered limb edge
        const b = lit[i] * (0.3 + 0.8 * tone[t]);
        // night side: dissolve into the black sky in dark mode, stay solid on white
        if (dark && b < 0.14 && w > b / 0.14) continue;
        if (ice[t]) put(d, idx[i], ICE[Math.min(2, Math.floor(b * 2.4 + w))]);
        else put(d, idx[i], TONES[Math.min(7, Math.floor(b * 7.6 + w))]);
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
