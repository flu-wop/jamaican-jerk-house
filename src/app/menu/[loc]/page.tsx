import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { orderableCategories } from "@/lib/menu";
import { isLocationSlug, locationList, locations } from "@/lib/site";
import MenuView from "@/components/menu/MenuView";
import OpenBadge from "@/components/layout/OpenBadge";

export function generateStaticParams() {
  return locationList.map((l) => ({ loc: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ loc: string }> }): Promise<Metadata> {
  const { loc } = await params;
  if (!isLocationSlug(loc)) return {};
  return {
    title: `Menu & Order, ${locations[loc].name}`,
    description: `Order Jamaican Jerk House for pickup at ${locations[loc].street}, ${locations[loc].cityLine}.`,
  };
}

export default async function LocationMenu({ params }: { params: Promise<{ loc: string }> }) {
  const { loc } = await params;
  if (!isLocationSlug(loc)) notFound();
  const l = locations[loc];
  const other = locations[loc === "metairie" ? "st-claude" : "metairie"];

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-10 md:pt-14">
        <p className="text-sm font-medium text-ember">Pickup menu</p>
        <h1 className="mt-1 font-display text-4xl font-semibold md:text-5xl">{l.name}</h1>
        <p className="mt-2 text-ink/70">
          {l.street}, {l.cityLine} ·{" "}
          <Link href={`/menu/${other.slug}`} className="underline underline-offset-4 hover:text-green">
            Switch to {other.name}
          </Link>
        </p>
        <OpenBadge location={l} className="mt-2 text-ink/70" />
      </section>
      <MenuView loc={loc} categories={orderableCategories(loc)} />
    </>
  );
}
