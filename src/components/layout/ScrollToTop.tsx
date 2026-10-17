"use client";

/**
 * Back-to-top button (appears after a screen and a half) and a scroll reset on
 * route change so a new page never opens halfway down.
 */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.querySelector<HTMLElement>("header a, header button")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 left-5 z-30 grid h-11 w-11 place-items-center rounded-full border border-ink/20 bg-cream/90 text-ink shadow backdrop-blur transition-all duration-300 hover:border-green hover:text-green md:bottom-8 md:left-8 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
