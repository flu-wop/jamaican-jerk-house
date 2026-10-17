import Link from "next/link";
import { mapsUrl, type Location } from "@/lib/site";
import OpenBadge from "@/components/layout/OpenBadge";

export default function LocationCard({ l, order = true }: { l: Location; order?: boolean }) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink/15 bg-white/40 p-8">
      <p className="mb-2 text-sm font-medium text-ember">{l.label}</p>
      <h3 className="mb-4 font-display text-2xl font-semibold">{l.name}</h3>
      <address className="not-italic text-ink/80">
        <p>{l.street}</p>
        <p>{l.cityLine}</p>
        <p className="mt-1">
          <a href={`tel:${l.phoneHref}`} className="hover:text-green">
            {l.phone}
          </a>
        </p>
      </address>
      <OpenBadge location={l} className="mt-4 text-ink/70" />
      <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm text-ink/70">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/45">Order &amp; pickup hours</p>
        {l.hours.map((h) => (
          <div key={h.days} className="flex justify-between">
            <span>{h.days}</span>
            <span>{h.hours}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {order && (
          <Link
            href={`/menu/${l.slug}`}
            className="rounded-full bg-green px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
          >
            Order pickup
          </Link>
        )}
        <a
          href={mapsUrl(l)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium hover:border-ink"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
