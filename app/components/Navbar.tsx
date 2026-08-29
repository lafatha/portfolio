"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
    const dark = stored === "dark" || (!stored && prefersDark);

    if (dark) {
      document.documentElement.classList.add("theme-dark");
    } else {
      document.documentElement.classList.remove("theme-dark");
    }

    setIsDark(dark);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("theme-dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 400);
  }

  return (
    <nav className="navbar sticky top-0 z-50 -mx-8 md:-mx-12 px-8 md:px-12 h-14 flex items-center justify-between">
      <div className="flex items-center gap-6 font-medium">
        <Link href="/" className="navbar-logo navbar-link transition-colors font-medium text-lg tracking-wide">
          gagah.tech
        </Link>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className="navbar-link transition-opacity hover:opacity-75 cursor-pointer select-none outline-none focus:outline-none flex items-center justify-center p-1"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        suppressHydrationWarning
      >
        <div
          className={`transition-transform duration-400 ease-in-out ${
            isRotating ? "rotate-180 scale-125" : "rotate-0 scale-100"
          }`}
        >
          {mounted ? (
            isDark ? (
              <Moon size={19} className="text-neutral-100" />
            ) : (
              <Sun size={19} className="text-neutral-800" />
            )
          ) : (
            <Sun size={19} className="text-neutral-800" />
          )}
        </div>
      </button>
    </nav>
  );
}
