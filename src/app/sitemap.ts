import type { MetadataRoute } from "next";
import { locationList, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
  const pages = ["", "/menu", "/catering", "/locations", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() })),
    ...locationList.map((l) => ({ url: `${site.url}/menu/${l.slug}`, lastModified: new Date() })),
  ];
}
