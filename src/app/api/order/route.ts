import { NextResponse } from "next/server";
import { findItem, priceItem, type LineInput, type PricedLine } from "@/lib/menu";
import { rateLimit } from "@/lib/rate-limit";
import { isLocationSlug } from "@/lib/site";

export const runtime = "nodejs";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Demo order endpoint. Prices every line from the real menu on the server and
 * ignores any amount the browser might send. No payment is taken and nothing is
 * stored; real ordering would hand the priced cart to Square Checkout.
 */
export async function POST(req: Request) {
  const wait = rateLimit(req, "order", { limit: 10, windowMs: 10 * 60 * 1000 });
  if (wait !== null) {
    return NextResponse.json(
      { error: `Too many orders. Please try again in ${Math.ceil(wait / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clip(body.website, 100)) return NextResponse.json({ ok: true, honeypot: true });

  const loc = body.location;
  if (!isLocationSlug(loc)) return NextResponse.json({ error: "Choose a pickup location." }, { status: 400 });

  const name = clip(body.name, 100);
  const phone = clip(body.phone, 40);
  const email = clip(body.email, 160);
  const notes = clip(body.notes, 300);
  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Please add a phone number we can text." }, { status: 400 });
  }
  if (email && !EMAIL.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  if (rawLines.length === 0 || rawLines.length > 40) {
    return NextResponse.json({ error: "Your order is empty." }, { status: 400 });
  }

  const lines: PricedLine[] = [];
  for (const raw of rawLines) {
    const l = (raw ?? {}) as Partial<LineInput>;
    const item = typeof l.itemId === "string" ? findItem(loc, l.itemId) : undefined;
    if (!item) {
      return NextResponse.json(
        { error: "An item in your order isn't on this location's menu anymore. Please re-add it." },
        { status: 400 }
      );
    }
    const priced = priceItem(item, {
      variantId: typeof l.variantId === "string" ? l.variantId : null,
      choices: l.choices && typeof l.choices === "object" ? (l.choices as LineInput["choices"]) : {},
      qty: Number(l.qty),
      note: typeof l.note === "string" ? l.note : "",
    });
    if (!priced.ok) {
      return NextResponse.json({ error: `${item.name}: ${priced.error}` }, { status: 400 });
    }
    lines.push(priced.line);
  }

  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const orderNumber = `JJH-${Math.floor(1000 + Math.random() * 9000)}`;

  return NextResponse.json({
    ok: true,
    demo: true,
    orderNumber,
    location: loc,
    name,
    phone,
    subtotal,
    lines,
    notes: notes || undefined,
  });
}
