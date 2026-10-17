import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-14 leading-relaxed text-ink/85">
      <h1 className="mb-6 font-display text-4xl font-semibold text-ink">Privacy</h1>
      <p className="mb-4 rounded-lg bg-gold/20 px-4 py-3 text-sm">
        Preview draft. The restaurant should review this text before launch.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">What we collect</h2>
      <p>
        When you place a pickup order, send a catering inquiry or use the contact form, we receive the details you
        type in: your name, phone number, email address (if you give one) and your message or order notes. We use
        them only to respond to you and to prepare your order.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">Your cart</h2>
      <p>
        Your current order is stored in your own browser so it&apos;s still there if you reload the page. It never
        leaves your device until you check out.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">What we don&apos;t do</h2>
      <p>
        We don&apos;t sell your information, and this site doesn&apos;t use advertising trackers or show a cookie
        banner.
      </p>
      <h2 className="mb-2 mt-8 font-display text-xl font-semibold text-ink">Questions</h2>
      <p>Call either location and ask to have your information removed.</p>
    </article>
  );
}
