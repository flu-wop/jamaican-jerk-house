"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { money, priceItem, type Item, type Selection } from "@/lib/menu";
import { locations, type LocationSlug } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";

export default function ItemDialog({
  item,
  loc,
  onClose,
}: {
  item: Item;
  loc: LocationSlug;
  onClose: () => void;
}) {
  const cart = useCart();
  const [variantId, setVariantId] = useState<string | null>(
    item.variants && item.variants.length ? item.variants[0].id : null
  );
  const [choices, setChoices] = useState<Selection>({});
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const input = useMemo(
    () => ({ itemId: item.id, variantId, choices, qty, note }),
    [item.id, variantId, choices, qty, note]
  );
  const result = useMemo(() => priceItem(item, input), [item, input]);

  // Live price ignores the "pick N" rules so it shows even before choices are complete.
  const livePrice = useMemo(() => {
    let unit = item.price;
    if (item.variants?.length) unit = item.variants.find((v) => v.id === variantId)?.price ?? unit;
    for (const m of item.modifiers ?? []) {
      for (const id of choices[m.id] ?? []) {
        unit += m.choices.find((c) => c.id === id)?.price ?? 0;
      }
    }
    return unit * qty;
  }, [item, variantId, choices, qty]);

  function toggle(modId: string, choiceId: string, max: number | null) {
    setError("");
    setChoices((prev) => {
      const cur = prev[modId] ?? [];
      if (cur.includes(choiceId)) return { ...prev, [modId]: cur.filter((c) => c !== choiceId) };
      if (max === 1) return { ...prev, [modId]: [choiceId] };
      if (max !== null && cur.length >= max) return prev;
      return { ...prev, [modId]: [...cur, choiceId] };
    });
  }

  function submit() {
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const ok = cart.add(loc, input, result.line);
    if (!ok) {
      setConflict(true);
      return;
    }
    onClose();
    cart.setOpen(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl">
        {item.image && (
          <div className="relative h-44 w-full shrink-0 bg-ink/10 sm:h-52">
            <Image src={item.image} alt={item.name} fill sizes="512px" className="object-cover" />
          </div>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream/90 text-ink shadow hover:bg-cream"
        >
          ✕
        </button>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <h3 className="font-display text-2xl font-semibold leading-tight">{item.name}</h3>
          {item.description && <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>}

          {item.variants && item.variants.length > 1 && (
            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-semibold">Size</legend>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={variantId === v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      variantId === v.id
                        ? "border-green bg-green text-cream"
                        : "border-ink/25 hover:border-ink"
                    }`}
                  >
                    {v.name} · {money(v.price)}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {(item.modifiers ?? []).map((m) => {
            const picked = choices[m.id] ?? [];
            const rule =
              m.min === 0 && m.max === null
                ? "Optional"
                : m.min === m.max
                ? m.min === 1
                  ? "Choose 1"
                  : `Choose ${m.min}`
                : m.min > 0
                ? `Choose at least ${m.min}`
                : `Up to ${m.max}`;
            return (
              <fieldset key={m.id} className="mt-5">
                <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-semibold">
                  <span>{m.name}</span>
                  <span className="text-xs font-normal text-ink/50">
                    {rule}
                    {m.max && m.max > 1 ? ` · ${picked.length}/${m.max}` : ""}
                  </span>
                </legend>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {m.choices.map((c) => {
                    const on = picked.includes(c.id);
                    const locked = !on && m.max !== null && m.max > 1 && picked.length >= m.max;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={on}
                        disabled={locked}
                        onClick={() => toggle(m.id, c.id, m.max)}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:opacity-40 ${
                          on ? "border-green bg-green/10" : "border-ink/20 hover:border-ink/60"
                        }`}
                      >
                        <span>{c.name}</span>
                        {c.price > 0 && <span className="text-xs text-ink/60">+{money(c.price)}</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <div className="mt-5">
            <label htmlFor="note" className="mb-1 block text-sm font-semibold">
              Special instructions <span className="font-normal text-ink/50">(optional)</span>
            </label>
            <input
              id="note"
              value={note}
              maxLength={140}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Allergy, no onions, extra sauce…"
              className="w-full rounded-xl border border-ink/20 bg-white/60 px-3 py-2 text-sm focus:border-green focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-ember">
              {error}
            </p>
          )}
          {conflict && (
            <div role="alert" className="mt-4 rounded-xl border border-ember/40 bg-ember/10 p-3 text-sm">
              <p>
                Your order is for <strong>{cart.loc ? locations[cart.loc].name : ""}</strong>. Menus and prices
                differ by location. Start a new order for <strong>{locations[loc].name}</strong>?
              </p>
              <button
                onClick={() => {
                  cart.switchLocation(loc);
                  setConflict(false);
                  setTimeout(submit, 0);
                }}
                className="mt-2 rounded-full bg-ember px-4 py-1.5 text-xs font-medium text-cream hover:bg-ink"
              >
                Clear and switch
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-ink/10 bg-cream px-6 py-4">
          <div className="flex items-center rounded-full border border-ink/25">
            <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 hover:text-ember">
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(25, q + 1))} className="h-10 w-10 hover:text-green">
              +
            </button>
          </div>
          <button
            onClick={submit}
            className="flex-1 rounded-full bg-green px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink"
          >
            Add to order · {money(livePrice)}
          </button>
        </div>
      </div>
    </div>
  );
}
