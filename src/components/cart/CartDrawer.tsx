"use client";

import Link from "next/link";
import { useEffect } from "react";
import { money } from "@/lib/menu";
import { locations } from "@/lib/site";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { open, setOpen, lines, loc, subtotal, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Your order"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream transition-transform duration-300 ${
          open ? "translate-x-0 shadow-2xl" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Your order</h2>
            {loc && (
              <p className="text-xs text-ink/60">
                Pickup · {locations[loc].name}
              </p>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close order"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/10"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="py-16 text-center text-ink/60">
              <p className="font-display text-lg text-ink">Nothing here yet.</p>
              <p className="mt-2 text-sm">Pick a plate from the menu to get started.</p>
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="mt-6 inline-block rounded-full bg-green px-6 py-3 text-sm font-medium text-cream hover:bg-ink"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {lines.map((l) => (
                <li key={l.key} className="py-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {l.view.name}
                        {l.view.variantName ? (
                          <span className="font-normal text-ink/60"> · {l.view.variantName}</span>
                        ) : null}
                      </p>
                      {l.view.options.length > 0 && (
                        <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                          {l.view.options.join(", ")}
                        </p>
                      )}
                      {l.view.note && (
                        <p className="mt-0.5 text-xs italic text-ink/60">“{l.view.note}”</p>
                      )}
                    </div>
                    <p className="whitespace-nowrap font-medium">{money(l.view.total)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-ink/20">
                      <button
                        aria-label={`Fewer ${l.view.name}`}
                        onClick={() => setQty(l.key, l.input.qty - 1)}
                        className="h-8 w-8 hover:text-ember"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{l.input.qty}</span>
                      <button
                        aria-label={`More ${l.view.name}`}
                        onClick={() => setQty(l.key, Math.min(25, l.input.qty + 1))}
                        className="h-8 w-8 hover:text-green"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(l.key)}
                      className="text-xs text-ink/50 underline underline-offset-4 hover:text-ember"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Subtotal</span>
              <span className="font-medium">{money(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-ink/50">Tax is added at pickup.</p>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-full bg-green px-6 py-3.5 text-center font-medium text-cream hover:bg-ink"
            >
              Checkout
            </Link>
            <p className="mt-2 text-center text-xs text-ink/50">
              No account needed. Takes under a minute.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
