import metairieRaw from "@/data/menu-metairie.json";
import stClaudeRaw from "@/data/menu-st-claude.json";
import type { LocationSlug } from "./site";

export type Choice = { id: string; name: string; price: number };
export type Modifier = {
  id: string;
  name: string;
  min: number;
  max: number | null;
  choices: Choice[];
};
export type Variant = { id: string; name: string; price: number };
export type Item = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  alcohol: boolean;
  /** Cents. With variants this is the lowest variant price. */
  price: number;
  variants?: Variant[];
  modifiers?: Modifier[];
};
export type Category = {
  id: string;
  slug: string;
  name: string;
  catering: boolean;
  items: Item[];
};
export type Menu = { categories: Category[] };

const menus: Record<LocationSlug, Menu> = {
  metairie: metairieRaw as Menu,
  "st-claude": stClaudeRaw as Menu,
};

export function getMenu(loc: LocationSlug): Menu {
  return menus[loc];
}

/** Everything except catering pans (those live on /catering). */
export function orderableCategories(loc: LocationSlug): Category[] {
  return menus[loc].categories.filter((c) => !c.catering);
}

export function cateringItems(loc: LocationSlug): Item[] {
  return menus[loc].categories.filter((c) => c.catering).flatMap((c) => c.items);
}

export function findItem(loc: LocationSlug, id: string): Item | undefined {
  for (const c of menus[loc].categories) {
    const hit = c.items.find((i) => i.id === id);
    if (hit) return hit;
  }
  return undefined;
}

export function findByName(loc: LocationSlug, name: string): Item | undefined {
  for (const c of menus[loc].categories) {
    const hit = c.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (hit) return hit;
  }
  return undefined;
}

export function money(cents: number): string {
  const d = cents / 100;
  return `$${d.toFixed(2)}`;
}

export function hasRange(item: Item): boolean {
  return !!item.variants && item.variants.length > 1;
}

/* ------------------------------------------------------------------ */
/* Pricing. Pure and shared: the browser uses it to show a live price,  */
/* the server re-runs it against the real menu and ignores any amount   */
/* the browser claims.                                                  */
/* ------------------------------------------------------------------ */

export type Selection = Record<string, string[]>;

export type LineInput = {
  itemId: string;
  variantId?: string | null;
  choices?: Selection;
  qty: number;
  note?: string;
};

export type PricedLine = {
  itemId: string;
  name: string;
  variantName?: string;
  options: string[];
  qty: number;
  unit: number;
  total: number;
  note?: string;
};

export const MAX_QTY = 25;
export const MAX_NOTE = 140;

export function priceItem(
  item: Item,
  input: Omit<LineInput, "itemId"> & { itemId?: string }
): { ok: true; line: PricedLine } | { ok: false; error: string } {
  const qty = input.qty;
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
    return { ok: false, error: `Quantity must be between 1 and ${MAX_QTY}.` };
  }

  let unit = item.price;
  let variantName: string | undefined;
  if (item.variants && item.variants.length) {
    const v = item.variants.find((x) => x.id === input.variantId);
    if (!v) return { ok: false, error: `Choose a size for ${item.name}.` };
    unit = v.price;
    variantName = v.name;
  }

  const options: string[] = [];
  for (const m of item.modifiers ?? []) {
    const picked = Array.from(new Set(input.choices?.[m.id] ?? []));
    if (picked.length < m.min) {
      return {
        ok: false,
        error:
          m.min === 1
            ? `Choose one: ${m.name}.`
            : `Choose ${m.min} for "${m.name}".`,
      };
    }
    if (m.max !== null && picked.length > m.max) {
      return { ok: false, error: `Too many choices for "${m.name}" (max ${m.max}).` };
    }
    for (const id of picked) {
      const c = m.choices.find((x) => x.id === id);
      if (!c) return { ok: false, error: `Invalid choice for "${m.name}".` };
      unit += c.price;
      options.push(c.price > 0 ? `${c.name} (+${money(c.price)})` : c.name);
    }
  }
  // Reject selections for modifiers the item doesn't have.
  for (const k of Object.keys(input.choices ?? {})) {
    if (!(item.modifiers ?? []).some((m) => m.id === k) && (input.choices?.[k]?.length ?? 0) > 0) {
      return { ok: false, error: "Invalid selection." };
    }
  }

  const note = typeof input.note === "string" ? input.note.trim().slice(0, MAX_NOTE) : "";
  return {
    ok: true,
    line: {
      itemId: item.id,
      name: item.name,
      variantName,
      options,
      qty,
      unit,
      total: unit * qty,
      note: note || undefined,
    },
  };
}
