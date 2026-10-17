import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-14 leading-relaxed text-ink/85">
      <h1 className="mb-6 font-display text-4xl font-semibold text-ink">Terms</h1>
      <p className="mb-4 rounded-lg bg-gold/20 px-4 py-3 text-sm">
        Preview draft. The restaurant should review this text before launch.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">Menu and pricing</h2>
      <p>
        Menus and prices can differ by location and change without notice. Sales tax is added at pickup. If an item
        is unavailable we&apos;ll contact you.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">Pickup orders</h2>
      <p>
        Orders are for pickup at the location you choose, during that location&apos;s hours. Please share any
        allergies in your order notes and confirm them with the staff at pickup.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">Catering</h2>
      <p>
        A catering inquiry is a request, not a booking. Date, quantity and price are confirmed with you directly.
      </p>
    </article>
  );
}
