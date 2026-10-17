"use client";

/**
 * Cart state. Lines carry a priced snapshot purely for display; the server
 * re-prices every line from the real menu at checkout and ignores these numbers.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LineInput, PricedLine } from "@/lib/menu";
import type { LocationSlug } from "@/lib/site";

export type CartLine = { key: string; input: LineInput; view: PricedLine };

type CartState = { loc: LocationSlug | null; lines: CartLine[] };

type Ctx = {
  loc: LocationSlug | null;
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Returns false if the cart belongs to another location and needs clearing first. */
  add: (loc: LocationSlug, input: LineInput, view: PricedLine) => boolean;
  switchLocation: (loc: LocationSlug) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "jjh-cart-v1";

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ loc: null, lines: [] });
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.lines)) setState(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const add = useCallback<Ctx["add"]>((loc, input, view) => {
    let ok = true;
    setState((s) => {
      if (s.loc && s.loc !== loc && s.lines.length > 0) {
        ok = false;
        return s;
      }
      const key = `${input.itemId}|${input.variantId ?? ""}|${JSON.stringify(
        Object.entries(input.choices ?? {}).sort()
      )}|${input.note ?? ""}`;
      const existing = s.lines.find((l) => l.key === key);
      if (existing) {
        const qty = Math.min(25, existing.input.qty + input.qty);
        return {
          loc,
          lines: s.lines.map((l) =>
            l.key === key
              ? {
                  ...l,
                  input: { ...l.input, qty },
                  view: { ...l.view, qty, total: l.view.unit * qty },
                }
              : l
          ),
        };
      }
      return { loc, lines: [...s.lines, { key, input, view }] };
    });
    return ok;
  }, []);

  const switchLocation = useCallback((loc: LocationSlug) => setState({ loc, lines: [] }), []);

  const setQty = useCallback((key: string, qty: number) => {
    setState((s) => ({
      ...s,
      lines:
        qty <= 0
          ? s.lines.filter((l) => l.key !== key)
          : s.lines.map((l) =>
              l.key === key
                ? {
                    ...l,
                    input: { ...l.input, qty },
                    view: { ...l.view, qty, total: l.view.unit * qty },
                  }
                : l
            ),
    }));
  }, []);

  const remove = useCallback((key: string) => {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) }));
  }, []);

  const clear = useCallback(() => setState((s) => ({ loc: s.loc, lines: [] })), []);

  const value = useMemo<Ctx>(
    () => ({
      loc: state.loc,
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.input.qty, 0),
      subtotal: state.lines.reduce((n, l) => n + l.view.total, 0),
      open,
      setOpen,
      add,
      switchLocation,
      setQty,
      remove,
      clear,
      hydrated,
    }),
    [state, open, add, switchLocation, setQty, remove, clear, hydrated]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
