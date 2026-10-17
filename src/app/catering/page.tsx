import type { Metadata } from "next";
import { cateringItems, money } from "@/lib/menu";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Catering",
  description: "Large pans of jerk chicken, curry, goat and sides from Jamaican Jerk House. Send us your date and headcount.",
};

export default function CateringPage() {
  const pans = cateringItems("metairie").sort((a, b) => a.price - b.price);
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-12 md:pt-16">
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          A crowd to feed? We&apos;ll bring the <em className="font-medium text-green">heat</em>.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/75">
          Large pans for parties, offices, repasts and family gatherings. Pick what you&apos;re craving, tell us the
          date and headcount, and we&apos;ll confirm details with you.
        </p>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="mb-6 font-display text-2xl font-semibold text-gold">Large pans</h2>
          <ul className="grid gap-x-12 gap-y-3 md:grid-cols-2">
            {pans.map((i) => (
              <li key={i.id} className="flex items-baseline">
                <span>{i.name.replace(/^lg\s+/i, "Large ").replace(/CocoCorn/i, "Coco Corn")}</span>
                <span className="menu-dots" />
                <span className="text-gold">{money(i.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-cream/50">
            Pan prices as listed on the restaurant&apos;s online store. Full-menu favorites can be quoted on request.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="mb-6 font-display text-2xl font-semibold">Tell us about your event</h2>
        <ContactForm kind="catering" />
      </section>
    </>
  );
}
