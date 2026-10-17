"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { money, hasRange, type Category, type Item } from "@/lib/menu";
import type { LocationSlug } from "@/lib/site";
import ItemDialog from "./ItemDialog";

export default function MenuView({ loc, categories }: { loc: LocationSlug; categories: Category[] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) => i.name.toLowerCase().includes(term) || (i.description ?? "").toLowerCase().includes(term)
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [q, categories]);

  return (
    <div>
      <div className="sticky top-[65px] z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the menu"
            aria-label="Search the menu"
            className="w-full rounded-full border border-ink/20 bg-white/60 px-4 py-2 text-sm focus:border-green focus:outline-none md:w-64"
          />
          <nav aria-label="Menu categories" className="-mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.slug}`}
                className="whitespace-nowrap rounded-full border border-ink/20 px-3.5 py-1.5 text-sm hover:border-green hover:text-green"
              >
                {c.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {filtered.length === 0 && (
          <p className="py-16 text-center text-ink/60">Nothing matches “{q}”. Try another word.</p>
        )}
        {filtered.map((c) => (
          <section key={c.id} id={c.slug} className="scroll-mt-40 pb-12">
            <h2 className="mb-5 font-display text-2xl font-semibold md:text-3xl">{c.name}</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {c.items.map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => setActive(i)}
                    className="group flex w-full items-stretch gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4 text-left transition-colors hover:border-green/60 hover:bg-white"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-medium leading-snug">{i.name}</h3>
                        <span className="whitespace-nowrap text-sm font-semibold text-green">
                          {hasRange(i) ? `from ${money(i.price)}` : money(i.price)}
                        </span>
                      </div>
                      {i.description && (
                        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink/65">{i.description}</p>
                      )}
                      <span className="mt-2 inline-block text-xs font-medium text-ember group-hover:underline">
                        Add to order +
                      </span>
                    </div>
                    {i.image && (
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                        <Image src={i.image} alt="" fill sizes="96px" className="object-cover" />
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {active && <ItemDialog key={active.id} item={active} loc={loc} onClose={() => setActive(null)} />}
    </div>
  );
}
