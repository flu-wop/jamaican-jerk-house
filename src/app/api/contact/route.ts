import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { isLocationSlug, locations, site } from "@/lib/site";

export const runtime = "nodejs";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const wait = rateLimit(req, "contact", { limit: 5, windowMs: 10 * 60 * 1000 });
  if (wait !== null) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${Math.ceil(wait / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (clip(body.website, 100)) return NextResponse.json({ ok: true });

  const kind = body.kind === "catering" ? "catering" : "general";
  const name = clip(body.name, 100);
  const email = clip(body.email, 160);
  const phone = clip(body.phone, 40);
  const message = clip(body.message, 3000);
  const date = clip(body.date, 40);
  const guests = clip(body.guests, 10);
  const locParam = clip(body.location, 20);
  const loc = isLocationSlug(locParam) ? locations[locParam].name : "";

  if (!name || !EMAIL.test(email) || !message) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }
  if (kind === "catering" && (!date || !guests)) {
    return NextResponse.json({ error: "Please add your event date and headcount." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO_EMAIL;

  // Demo mode: the restaurant's inbox isn't configured yet, so nothing is sent.
  if (!key || !to) return NextResponse.json({ ok: true, demo: true });

  const subject =
    kind === "catering" ? `Catering inquiry: ${name} (${guests} guests, ${date})` : `Website message: ${name}`;
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ...(kind === "catering"
      ? ([
          ["Event date", date],
          ["Guests", guests],
          ["Pickup location", loc || "—"],
        ] as [string, string][])
      : []),
  ];
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
    <h2 style="margin:0 0 12px">${esc(subject)}</h2>
    <table style="border-collapse:collapse;width:100%">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`
      )
      .join("")}</table>
    <p style="white-space:pre-wrap;border-top:1px solid #ddd;margin-top:12px;padding-top:12px">${esc(message)}</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to,
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "We couldn't send that just now.", ...(site.email ? { fallback: "mailto" } : {}) },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We couldn't send that just now.", ...(site.email ? { fallback: "mailto" } : {}) },
      { status: 502 }
    );
  }
}
