import type { Metadata } from "next";
import { locationList } from "@/lib/site";
import LocationCard from "@/components/sections/LocationCard";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Choose St. Claude or Metairie and order Jamaican Jerk House for pickup.",
};

export default function MenuIndex() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <h1 className="font-display text-4xl font-semibold md:text-5xl">
        Where are you <em className="font-medium text-green">picking up</em>?
      </h1>
      <p className="mb-10 mt-3 max-w-xl text-ink/70">
        Menus and a few prices differ by location, so pick your kitchen first.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        {locationList.map((l) => (
          <LocationCard key={l.slug} l={l} />
        ))}
      </div>
    </section>
  );
}
