/**
 * Single source of truth for business facts.
 * Locations, phones and pickup hours come from the restaurant's own Square
 * Online store (Oct 2026) and the original site.
 */

export const site = {
  name: "Jamaican Jerk House",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://jamaican-jerk-house-demo.vercel.app",
  // Previews stay out of search until the client signs. Flip with SITE_INDEXABLE=true at launch.
  indexable: process.env.SITE_INDEXABLE === "true",
  description:
    "Home-grown Kingston jerk from Richard Rose and Jackie Diaz. Two locations: the Upper Ninth Ward original on St. Claude and Metairie on Veterans.",
  tagline: "Feeding our community fresh food daily. One love.",
  logo: "https://0c5bb43d305fed74f010.cdn6.editmysite.com/uploads/b/0c5bb43d305fed74f010be4cef9ec539d24182cb2cc4e24edf96f3f409b93825/9.13.2024_66e48a01411dc4.98246396.png",
  // Optional fallback address for a failed send; unset until the client provides one.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
} as const;

export type LocationSlug = "st-claude" | "metairie";

export type HourRow = { days: string; hours: string };

export type Location = {
  slug: LocationSlug;
  label: string;
  name: string;
  street: string;
  cityLine: string;
  phone: string;
  phoneHref: string;
  /** Day index (0 = Sunday) -> [open, close] in 24h "HH:MM", or null when closed. */
  schedule: Record<number, [string, string] | null>;
  /** Grouped rows for display. */
  hours: HourRow[];
};

export const locations: Record<LocationSlug, Location> = {
  "st-claude": {
    slug: "st-claude",
    label: "The Original",
    name: "Upper Ninth Ward",
    street: "4017 St. Claude Ave",
    cityLine: "New Orleans, LA 70117",
    phone: "(504) 777-7799",
    phoneHref: "+15047777799",
    schedule: {
      0: ["11:30", "16:00"],
      1: null,
      2: ["11:30", "18:00"],
      3: ["11:30", "18:00"],
      4: ["11:30", "18:00"],
      5: ["11:30", "21:00"],
      6: ["11:30", "21:00"],
    },
    hours: [
      { days: "Tue – Thu", hours: "11:30am – 6pm" },
      { days: "Fri – Sat", hours: "11:30am – 9pm" },
      { days: "Sun", hours: "11:30am – 4pm" },
      { days: "Mon", hours: "Closed" },
    ],
  },
  metairie: {
    slug: "metairie",
    label: "The Expansion",
    name: "Metairie",
    street: "4445 Veterans Memorial Blvd",
    cityLine: "Metairie, LA 70006",
    phone: "(504) 266-0613",
    phoneHref: "+15042660613",
    schedule: {
      0: ["11:00", "20:30"],
      1: null,
      2: ["11:00", "20:30"],
      3: ["11:00", "20:30"],
      4: ["11:00", "20:30"],
      5: ["11:00", "22:30"],
      6: ["11:00", "22:30"],
    },
    hours: [
      { days: "Tue – Thu, Sun", hours: "11am – 8:30pm" },
      { days: "Fri – Sat", hours: "11am – 10:30pm" },
      { days: "Mon", hours: "Closed" },
    ],
  },
};

export const locationList: Location[] = [locations["st-claude"], locations.metairie];

export function isLocationSlug(v: unknown): v is LocationSlug {
  return v === "st-claude" || v === "metairie";
}

export function mapsUrl(l: Location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Jamaican Jerk House ${l.street} ${l.cityLine}`
  )}`;
}

export const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];
