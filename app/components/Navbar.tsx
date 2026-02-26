"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

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
  }, []);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("theme-dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <nav className="navbar sticky top-0 z-50 -mx-8 md:-mx-12 px-8 md:px-12 py-4 mb-0 -mt-8 md:-mt-8 flex items-center justify-between">
      <div className="flex items-center gap-6 font-medium">
        <Link href="/" className="navbar-link transition-colors">
          home
        </Link>
        <Link href="/gallery" className="navbar-link transition-colors">
          gallery
        </Link>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={toggleTheme}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTheme();
          }
        }}
        className="navbar-link font-medium cursor-pointer select-none"
      >
        {isDark ? "light" : "dark"}
      </span>
    </nav>
  );
}
