import type { MetadataRoute } from "next";
import { getPublishedItems, getPublishedMods } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [mods, items] = await Promise.all([getPublishedMods(), getPublishedItems()]);

  return [
    "",
    "/mods",
    "/buscar",
    "/instalacion",
    "/faq",
    ...mods.map((mod) => `/mods/${mod.slug}`),
    ...items.map((item) => `/items/${item.slug}`),
  ].map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" }));
}
