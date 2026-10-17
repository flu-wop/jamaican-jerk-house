import type { Metadata } from "next";
import CheckoutForm from "@/components/forms/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <h1 className="mb-8 font-display text-4xl font-semibold">Checkout</h1>
      <CheckoutForm />
    </section>
  );
}
