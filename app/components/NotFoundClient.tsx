"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaLinkedin } from "react-icons/fa";

export default function NotFoundClient() {
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
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      {/* Container centered on page */}
      <div className="flex flex-col items-center justify-center max-w-md w-full my-auto">
        {/* gagah.tech Logo placed directly above 404 block */}
        <Link
          href="/"
          className="navbar-link font-medium text-2xl md:text-3xl tracking-wide mb-6 inline-block"
          style={{ fontFamily: "var(--font-betania-patmos)" }}
        >
          gagah.tech
        </Link>

        {/* 404 & Message Block */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-xl md:text-2xl font-semibold border-r border-neutral-300 dark:border-neutral-700 pr-4">
            404
          </span>
          <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
            This page could not be found.
          </span>
        </div>

        {/* Action Buttons: Rectangular / No Rounded, No Arrow on Home button, plus LinkedIn button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-none bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Go to Home
          </Link>

          <a
            href="https://linkedin.com/in/gagahathallahfatha"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-none border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 px-5 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FaLinkedin size={16} className="text-current" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </main>
  );
}
