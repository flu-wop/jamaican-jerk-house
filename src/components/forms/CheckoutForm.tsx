"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { money } from "@/lib/menu";
import { locations } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";

export default function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!cart.hydrated) return <div className="h-64" aria-busy />;

  if (!cart.loc || cart.lines.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/15 bg-white/50 p-10 text-center">
        <p className="font-display text-2xl font-semibold">Your order is empty.</p>
        <p className="mt-2 text-ink/65">Pick a location and add a plate or two.</p>
        <Link href="/menu" className="mt-6 inline-block rounded-full bg-green px-7 py-3 font-medium text-cream hover:bg-ink">
          Browse the menu
        </Link>
      </div>
    );
  }

  const loc = locations[cart.loc];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !cart.loc) return;
    setBusy(true);
    setError("");
    try {
      // Only IDs and selections go up. The server prices everything itself.
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: cart.loc,
          name,
          phone,
          email,
          notes,
          website,
          lines: cart.lines.map((l) => ({
            itemId: l.input.itemId,
            variantId: l.input.variantId,
            choices: l.input.choices,
            qty: l.input.qty,
            note: l.input.note,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      try {
        sessionStorage.setItem("jjh-last-order", JSON.stringify(data));
      } catch {
        /* ignore */
      }
      cart.clear();
      router.push("/order/confirmed");
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base focus:border-green focus:outline-none";

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <form onSubmit={onSubmit} className="space-y-5 lg:col-span-3">
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="co-website">Website</label>
          <input id="co-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div className="rounded-2xl border border-ink/15 bg-white/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Pickup at</p>
          <p className="mt-1 font-display text-xl font-semibold">{loc.name}</p>
          <p className="text-sm text-ink/70">
            {loc.street}, {loc.cityLine}
          </p>
          <p className="mt-2 text-sm text-ink/60">Ready as soon as the kitchen can get it out. We&apos;ll text you.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="co-name" className="mb-1 block text-sm font-medium">Name</label>
            <input id="co-name" required autoComplete="name" className={field} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="co-phone" className="mb-1 block text-sm font-medium">Mobile number</label>
            <input id="co-phone" required type="tel" autoComplete="tel" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="co-email" className="mb-1 block text-sm font-medium">
            Email <span className="font-normal text-ink/50">(for your receipt, optional)</span>
          </label>
          <input id="co-email" type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="co-notes" className="mb-1 block text-sm font-medium">
            Order notes <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <textarea id="co-notes" rows={3} maxLength={300} className={`${field} resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-ember">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-green px-8 py-4 font-medium text-cream transition-colors hover:bg-ink disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Placing order…" : `Place order · ${money(cart.subtotal)}`}
        </button>
        <p className="text-xs text-ink/55">
          Preview checkout: no payment is taken and no order reaches the kitchen. Live ordering would run
          through the restaurant&apos;s Square account.
        </p>
      </form>

      <aside className="lg:col-span-2">
        <div className="rounded-2xl border border-ink/15 bg-white/50 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Your order</h2>
          <ul className="mt-3 divide-y divide-ink/10">
            {cart.lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">
                    {l.input.qty} × {l.view.name}
                    {l.view.variantName ? ` · ${l.view.variantName}` : ""}
                  </p>
                  {l.view.options.length > 0 && <p className="text-xs text-ink/60">{l.view.options.join(", ")}</p>}
                  {l.view.note && <p className="text-xs italic text-ink/60">“{l.view.note}”</p>}
                  <div className="mt-1 flex gap-3 text-xs">
                    <button type="button" onClick={() => cart.setQty(l.key, l.input.qty - 1)} className="text-ink/50 underline underline-offset-2 hover:text-ember">
                      {l.input.qty === 1 ? "Remove" : "Fewer"}
                    </button>
                    {l.input.qty < 25 && (
                      <button type="button" onClick={() => cart.setQty(l.key, l.input.qty + 1)} className="text-ink/50 underline underline-offset-2 hover:text-green">
                        More
                      </button>
                    )}
                  </div>
                </div>
                <span className="whitespace-nowrap font-medium">{money(l.view.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-medium">
            <span>Subtotal</span>
            <span>{money(cart.subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink/55">Tax is added at pickup.</p>
        </div>
      </aside>
    </div>
  );
}
