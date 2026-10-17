import Image from "next/image";
import Link from "next/link";
import { locationList, navLinks, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Image src={site.logo} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg text-cream">{site.name}</span>
          </div>
          <p className="max-w-xs text-sm">{site.tagline}</p>
        </div>

        {locationList.map((l) => (
          <div key={l.slug} className="space-y-1 text-sm">
            <p className="mb-2 font-medium text-cream">{l.name}</p>
            <p>{l.street}</p>
            <p>{l.cityLine}</p>
            <p>
              <a href={`tel:${l.phoneHref}`} className="hover:text-gold">
                {l.phone}
              </a>
            </p>
          </div>
        ))}

        <div className="text-sm">
          <p className="mb-2 font-medium text-cream">Explore</p>
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-cream/50 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>
              &copy; {year} {site.name}. All rights reserved.
            </p>
            <Link href="/privacy" className="hover:text-cream">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cream">
              Terms
            </Link>
          </div>
          <a
            href="https://in-flu-ential.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream"
          >
            Designed by IN-FLU-ENTIAL
          </a>
        </div>
      </div>
    </footer>
  );
}
