import type { Metadata } from "next";
import { locationList } from "@/lib/site";
import LocationCard from "@/components/sections/LocationCard";

export const metadata: Metadata = {
  title: "Locations & Hours",
  description: "Jamaican Jerk House on St. Claude Ave in the Upper Ninth Ward and on Veterans Memorial Blvd in Metairie.",
};

export default function LocationsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <h1 className="mb-2 font-display text-4xl font-semibold md:text-5xl">Two locations</h1>
      <p className="mb-10 text-ink/70">Hours shown are the pickup and ordering windows from the restaurant&apos;s online store.</p>
      <div className="grid gap-8 md:grid-cols-2">
        {locationList.map((l) => (
          <LocationCard key={l.slug} l={l} />
        ))}
      </div>
    </section>
  );
}
