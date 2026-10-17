import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { locationList } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call either Jamaican Jerk House location or send a message.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-5 md:py-16">
      <div className="md:col-span-3">
        <h1 className="mb-3 font-display text-4xl font-semibold md:text-5xl">Say hello</h1>
        <p className="mb-8 text-ink/70">
          Questions, feedback or a private event? Send a note below. For an order that&apos;s already in the
          works, call the location directly.
        </p>
        <ContactForm />
      </div>
      <aside className="space-y-6 md:col-span-2">
        {locationList.map((l) => (
          <div key={l.slug} className="rounded-2xl border border-ink/15 bg-white/50 p-6">
            <h2 className="font-display text-xl font-semibold">{l.name}</h2>
            <p className="mt-1 text-sm text-ink/70">
              {l.street}, {l.cityLine}
            </p>
            <a href={`tel:${l.phoneHref}`} className="mt-2 inline-block font-medium text-green hover:underline">
              {l.phone}
            </a>
          </div>
        ))}
      </aside>
    </section>
  );
}
