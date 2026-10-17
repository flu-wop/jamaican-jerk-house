"use client";

/**
 * Posts to /api/contact. With Resend configured it emails the restaurant; in demo
 * mode the API validates and returns ok without sending. If a send fails and a
 * contact email is configured, it hands off to a prefilled mailto:.
 */
import { useEffect, useRef, useState } from "react";
import { locationList, site } from "@/lib/site";

export default function ContactForm({ kind = "general" }: { kind?: "general" | "catering" }) {
  const catering = kind === "catering";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState<string>(locationList[0].slug);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState("");
  const sentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") sentRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [status]);

  function openMail() {
    if (!site.email) return;
    const subject = encodeURIComponent(catering ? `Catering inquiry — ${name}` : `Message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}${
        catering ? `\nDate: ${date}\nGuests: ${guests}` : ""
      }\n\n${message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, name, email, phone, date, guests, location, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDemo(!!data.demo);
        setStatus("sent");
        return;
      }
      setStatus("idle");
      if (data.fallback === "mailto") {
        openMail();
        return;
      }
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("idle");
      if (site.email) openMail();
      else setError("Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div ref={sentRef} role="status" className="rounded-2xl border border-ink/15 bg-white/50 p-8">
        <p className="font-display text-3xl font-semibold">
          {catering ? "Inquiry received." : "Message received."}
        </p>
        <p className="mt-3 max-w-md leading-relaxed text-ink/75">
          Thanks, {name.split(" ")[0] || "friend"}. We&apos;ll be in touch soon.
        </p>
        {demo && (
          <p className="mt-4 rounded-lg bg-gold/20 px-3 py-2 text-xs text-ink/70">
            Preview note: this demo validates the form but doesn&apos;t send email yet. When the site goes
            live, inquiries arrive in the restaurant&apos;s inbox.
          </p>
        )}
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-base focus:border-green focus:outline-none";
  const label = "mb-1 block text-sm font-medium";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>Your name</label>
          <input id="cf-name" required autoComplete="name" className={field} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>Email</label>
          <input id="cf-email" required type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cf-phone" className={label}>
            Phone <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <input id="cf-phone" type="tel" autoComplete="tel" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        {catering && (
          <div>
            <label htmlFor="cf-loc" className={label}>Pickup location</label>
            <select id="cf-loc" className={field} value={location} onChange={(e) => setLocation(e.target.value)}>
              {locationList.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name} — {l.street}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {catering && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="cf-date" className={label}>Event date</label>
            <input id="cf-date" required type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="cf-guests" className={label}>How many guests?</label>
            <input id="cf-guests" required inputMode="numeric" className={field} value={guests} onChange={(e) => setGuests(e.target.value.replace(/\D/g, ""))} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="cf-message" className={label}>
          {catering ? "What are you planning?" : "How can we help?"}
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          className={`${field} resize-none`}
          placeholder={catering ? "Dishes you're eyeing, dietary needs, pickup time…" : ""}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-ember">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-green px-8 py-3.5 font-medium text-cream transition-colors hover:bg-ink disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : catering ? "Send catering inquiry" : "Send message"}
        </button>
        <p className="mt-2 text-xs text-ink/55">A real person replies. No spam, no mailing list.</p>
      </div>
    </form>
  );
}
