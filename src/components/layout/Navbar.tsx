"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={site.logo}
            alt="Jamaican Jerk House logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full bg-ink object-cover"
          />
          <span className="font-display text-lg font-semibold leading-none">
            Jamaican
            <br className="hidden sm:block" /> Jerk House
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors hover:text-green ${
                pathname.startsWith(l.href) ? "text-green" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open order, ${count} item${count === 1 ? "" : "s"}`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/20 hover:border-green"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-semibold text-cream">
                {count}
              </span>
            )}
          </button>
          <Link
            href="/menu"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-green sm:block"
          >
            Order Online
          </Link>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
            aria-expanded={menu}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d={menu ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-ink/10 bg-cream px-6 py-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {[{ href: "/menu", label: "Order Online" }, ...navLinks.filter((l) => l.href !== "/menu")].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-lg px-2 py-3 text-lg font-display hover:bg-ink/5">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
