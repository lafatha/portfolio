"use client";

import { useEffect, useRef } from "react";

const ASCII_CHARS = [
  "0x98",
  "0x4F",
  "0x1A",
  "0xFE",
  "0x7B",
  "0x3C",
  "0x8D",
  "0x2E",
  "0xA5",
  "0xBB",
  "0xCC",
  "0x0F",
  "0x64",
  "0xE2",
  "0x89",
  "0x71",
  "0x9A",
  "0x5C",
  "0xB3",
  "0xD4",
  "0x1E",
  "0xF8",
  "0x42",
  "0x83",
  "::",
  "··",
  "°",
  "*",
  "+",
  "%",
  "#",
  "¤",
  "@",
  "&",
  "§",
  "∆",
  "≈",
];

export default function AsciiBannerOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const cols = 38;
    const rows = 21;


    interface Cell {
      char: string;
      opacity: number;
      targetOpacity: number;
      speed: number;
      isLightArea: boolean;
    }

    let grid: Cell[][] = [];

    // STRICT MASK:
    // Full ASCII coverage across the entire left section (normX < 0.44).
    // Stop strictly before the skyscraper building starts at X = 44%.
    function checkIsLightArea(c: number): boolean {
      const normX = c / cols;
      return normX < 0.44;
    }

    function initGrid() {
      grid = [];
      for (let r = 0; r < rows; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < cols; c++) {
          const isLight = checkIsLightArea(c);
          row.push({
            char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
            opacity: Math.random() * 0.4 + 0.35,
            targetOpacity: Math.random() * 0.5 + 0.4,
            speed: Math.random() * 0.0125 + 0.0055,
            isLightArea: isLight,
          });
        }
        grid.push(row);
      }
    }

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initGrid();
    }

    resize();
    window.addEventListener("resize", resize);

    let lastTick = 0;

    function render(time: number) {
      if (!ctx || !grid || grid.length === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (time - lastTick > 22) {
        lastTick = time;

        ctx.clearRect(0, 0, width, height);

        // Responsive font size: 6.5px on mobile screens (< 640px) for small, delicate ASCII look matching PC
        const fontSize = width < 640 ? "6.5px" : "9px";
        ctx.font = `${fontSize} monospace`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        const cellW = width / cols;
        const startY = 4;
        const endY = height - 4;
        const rowStep = (endY - startY) / (rows - 1);

        for (let r = 0; r < rows; r++) {
          if (!grid[r]) continue;
          const y = startY + r * rowStep;

          for (let c = 0; c < cols; c++) {
            const cell = grid[r][c];
            if (!cell) continue;

            if (!cell.isLightArea) continue;

            if (Math.abs(cell.opacity - cell.targetOpacity) < 0.03) {
              cell.targetOpacity = Math.random() * 0.5 + 0.4;
              cell.speed = Math.random() * 0.0125 + 0.0055;
              if (Math.random() < 0.17) {
                cell.char =
                  ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
              }
            }

            if (cell.opacity < cell.targetOpacity) {
              cell.opacity += cell.speed;
            } else {
              cell.opacity -= cell.speed;
            }

            const finalOpacity = Math.max(0, Math.min(0.9, cell.opacity));

            if (finalOpacity > 0.05) {
              const x = c * cellW + cellW / 2;

              if (cell.char.startsWith("0x")) {
                ctx.fillStyle = `rgba(255, 235, 160, ${finalOpacity * 0.95})`;
              } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.85})`;
              }

              ctx.fillText(cell.char, x, y);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-90 z-10"
    />
  );
}
