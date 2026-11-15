"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { BAYER } from "./MarsBanner";

/**
 * A small rocket that patrols the banner on a shallow orbital arc, pitching over
 * at each edge to fly back. Grab it with the cursor to drag it anywhere; on
 * release it eases back onto the orbit and carries on.
 */

const ASPECT = 82 / 200; // width / height of rocket.webp
const SPEED = 0.018; // px per ms along the orbit
const PX = 2; // css px per flame pixel (matches the Mars banner)
const FLAME = [[170, 40, 22], [255, 106, 26], [255, 197, 51], [255, 243, 208]]; // ember -> core

export default function RocketOrbit() {
  const wrap = useRef<HTMLDivElement>(null);
  const rocket = useRef<HTMLDivElement>(null);
  const flame = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const el = rocket.current;
    const fl = flame.current;
    const fctx = fl?.getContext("2d");
    if (!box || !el || !fl || !fctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0, H = 0, rh = 0, rw = 0;
    let x = 0, dir = 1, ang = 90, yOff = 0, py = 0;
    let turn = 0, turnGoal = 0; // turn: 0 cruising, +1 clockwise, -1 counter-clockwise
    let dragging = false, grabX = 0, grabY = 0, lastX = 0;
    let raf = 0, last = 0, visible = true, flameAt = 0;
    let fw = 0, fh = 0, fimg: ImageData;

    const xMin = () => rh * 1.4;
    const xMax = () => W - rh * 1.4;
    // orbit: high at the edges, dipping in front of the planet in the middle
    const orbitY = (px: number) => {
      const u = (px - xMin()) / Math.max(1, xMax() - xMin());
      return H * 0.3 + H * 0.3 * Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
    };

    function resize() {
      const r = box!.getBoundingClientRect();
      W = r.width; H = r.height;
      rh = Math.min(88, H * 0.42);
      rw = rh * ASPECT;
      el!.style.width = `${rw}px`;
      el!.style.height = `${rh}px`;
      fw = Math.max(4, Math.round((rw * 0.7) / PX));
      fh = Math.max(4, Math.round((rh * 0.36) / PX));
      fl!.width = fw; fl!.height = fh;
      fl!.style.width = `${fw * PX}px`; fl!.style.height = `${fh * PX}px`;
      fimg = fctx!.createImageData(fw, fh);
      x = Math.min(Math.max(x || xMin(), xMin()), xMax());
    }

    function place() {
      el!.style.transform = `translate(${x - rw / 2}px, ${py - rh / 2}px) rotate(${ang}deg)`;
    }

    // Dithered exhaust cone: narrow at the nozzle, widening and fading toward the tail.
    function drawFlame(time: number, power: number) {
      const d = fimg.data;
      d.fill(0);
      const len = fh * (0.5 + 0.5 * power);
      for (let r = 0; r < fh; r++) {
        const v0 = r / len;
        if (v0 >= 1) break;
        const half = ((0.14 + 0.86 * v0) * fw) / 2; // widens with distance
        for (let c = 0; c < fw; c++) {
          const u = Math.abs(c + 0.5 - fw / 2) / half;
          if (u >= 1) continue;
          const flick = 0.16 * Math.sin(r * 0.9 - time * 0.02 + c * 0.7) + 0.08 * Math.sin(c * 1.9 + time * 0.013);
          const v = Math.max(0, Math.min(1, (1 - v0) * 0.8 + (1 - u) * 0.4 - 0.04 + flick));
          const w = (BAYER[(r % 4) * 4 + (c % 4)] + 0.5) / 16;
          if (w > v * 1.25) continue;
          const col = FLAME[Math.min(3, Math.floor(v * 3.4 + w))];
          const k = (r * fw + c) * 4;
          d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
        }
      }
      fctx!.putImageData(fimg, 0, 0);
    }

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(t - last, 50);
      last = t;
      if (!visible || document.hidden) return;

      let target = ang;
      if (dragging) {
        target = Math.max(-25, Math.min(25, (x - lastX) * 3)); // swing with the drag
        lastX = x;
      } else {
        const v = still.matches ? 0 : SPEED * dt;
        if (turn) {
          // U-turn along a real arc: nose pitches steadily while the rocket keeps moving forward
          const rad = (ang * Math.PI) / 180;
          ang += turn * (v / (rh * 0.38)) * (180 / Math.PI);
          x += Math.sin(rad) * v;
          py -= Math.cos(rad) * v;
          if ((ang - turnGoal) * turn >= 0) {
            ang = ((((turnGoal + 180) % 360) + 360) % 360) - 180;
            turn = 0;
            yOff = py - orbitY(x);
          }
        } else {
          const slope = (orbitY(x + 1) - orbitY(x - 1)) / 2;
          const dy = -yOff * (1 - Math.exp(-dt / 3500)); // climb gently back onto the orbit
          yOff += dy;
          x += dir * v;
          py = orbitY(x) + yOff;
          // heading follows the actual velocity vector
          target = (Math.atan2(dir * v, -(slope * dir * v + dy)) * 180) / Math.PI;
          if (v === 0) target = ang;
          if ((dir > 0 && x > xMax()) || (dir < 0 && x < xMin())) {
            const right = dir > 0;
            x = right ? xMax() : xMin();
            dir = right ? -1 : 1;
            turn = right ? 1 : -1; // always loop through the underside
            const sl = (orbitY(x + 1) - orbitY(x - 1)) / 2;
            let g = (Math.atan2(dir, -dir * sl) * 180) / Math.PI;
            while (turn > 0 && g < ang) g += 360;
            while (turn < 0 && g > ang) g -= 360;
            turnGoal = g;
          }
        }
      }
      fl!.style.opacity = dragging ? "0" : "1"; // engine off while held
      if (!dragging && t - flameAt > 90) { flameAt = t; drawFlame(t, 1); }
      if (!turn) ang += (target - ang) * (1 - Math.exp(-dt / 140));
      place();
    }

    function down(e: PointerEvent) {
      dragging = true;
      turn = 0;
      grabX = e.clientX - box!.getBoundingClientRect().left - x;
      grabY = e.clientY - box!.getBoundingClientRect().top - py;
      lastX = x;
      el!.setPointerCapture(e.pointerId);
      el!.style.cursor = "grabbing";
      e.preventDefault();
    }
    function move(e: PointerEvent) {
      if (!dragging) return;
      const r = box!.getBoundingClientRect();
      x = Math.min(Math.max(e.clientX - r.left - grabX, rw / 2), W - rw / 2);
      py = Math.min(Math.max(e.clientY - r.top - grabY, rh / 2), H - rh / 2);
    }
    function up() {
      if (!dragging) return;
      dragging = false;
      turn = 0;
      x = Math.min(Math.max(x, xMin()), xMax());
      yOff = py - orbitY(x);
      el!.style.cursor = "grab";
    }

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    ro.observe(box);
    io.observe(box);
    resize();
    py = orbitY(x);
    place();
    el.style.opacity = "1"; // reveal only once positioned (avoids a flash at the corner on load)
    last = performance.now();
    raf = requestAnimationFrame(frame);

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={rocket}
        className="absolute left-0 top-0 pointer-events-auto cursor-grab select-none will-change-transform opacity-0 transition-opacity duration-500"
        style={{ touchAction: "none", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}
      >
        <canvas
          ref={flame}
          className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 pointer-events-none transition-opacity duration-150"
          style={{ imageRendering: "pixelated" }}
        />
        <Image src="/rocket.webp" alt="" width={82} height={200} unoptimized draggable={false} className="relative h-full w-full pointer-events-none" />
      </div>
    </div>
  );
}
