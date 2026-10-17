"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money, type PricedLine } from "@/lib/menu";
import { isLocationSlug, locations, type LocationSlug } from "@/lib/site";

type Order = {
  orderNumber: string;
  location: LocationSlug;
  name: string;
  subtotal: number;
  lines: PricedLine[];
  notes?: string;
};

export default function ConfirmedPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("jjh-last-order");
      const parsed = raw ? (JSON.parse(raw) as Order) : null;
      setOrder(parsed && isLocationSlug(parsed.location) ? parsed : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) return <div className="h-96" aria-busy />;

  if (!order) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">No recent order.</h1>
        <Link href="/menu" className="mt-6 inline-block rounded-full bg-green px-7 py-3 font-medium text-cream hover:bg-ink">
          Browse the menu
        </Link>
      </section>
    );
  }

  const loc = locations[order.location];
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <p className="font-medium text-green">Order {order.orderNumber}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">
        Thank you, {order.name.split(" ")[0]}. Your order is in.
      </h1>
      <p className="mt-4 text-lg text-ink/75">
        Pickup at <strong>{loc.name}</strong>, {loc.street}. We&apos;ll text you when it&apos;s ready.
      </p>

      <div className="mt-8 rounded-2xl border border-ink/15 bg-white/50 p-6">
        <ul className="divide-y divide-ink/10">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-medium">
                  {l.qty} × {l.name}
                  {l.variantName ? ` · ${l.variantName}` : ""}
                </p>
                {l.options.length > 0 && <p className="text-xs text-ink/60">{l.options.join(", ")}</p>}
              </div>
              <span className="whitespace-nowrap font-medium">{money(l.total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-medium">
          <span>Subtotal (priced by the server)</span>
          <span>{money(order.subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-ink/55">Tax is added at pickup.</p>
      </div>

      <p className="mt-6 rounded-lg bg-gold/20 px-4 py-3 text-sm text-ink/75">
        Preview note: this is a demo order. Nothing was charged and the kitchen didn&apos;t receive it.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href={`tel:${loc.phoneHref}`} className="rounded-full border border-ink/30 px-6 py-3 font-medium hover:border-ink">
          Call {loc.phone}
        </a>
        <Link href="/" className="rounded-full bg-ink px-6 py-3 font-medium text-cream hover:bg-green">
          Back home
        </Link>
      </div>
    </section>
  );
}
