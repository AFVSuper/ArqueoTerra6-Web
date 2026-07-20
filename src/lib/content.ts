import "server-only";

import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  craftingRecipes,
  faqEntries,
  installationSections,
  itemRelations,
  items,
  itemTags,
  mods,
  modTags,
  tags,
} from "@/lib/db/schema";
import { safeJsonParse, type RecipeInput } from "@/lib/utils";

export type PublicModCard = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  coverImage: string | null;
  featured: boolean;
  itemCount: number;
  tags: string[];
};

export type PublicItemCard = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  image: string | null;
  durability: number | null;
  modTitle: string;
  modSlug: string;
  tags: string[];
  // obtainMethod: string;
};

async function getModTags(modIds: number[]) {
  const tagMap = new Map<number, string[]>();
  if (modIds.length === 0) return tagMap;

  const rows = await getDb()
    .select({ modId: modTags.modId, name: tags.name })
    .from(modTags)
    .innerJoin(tags, eq(modTags.tagId, tags.id))
    .where(inArray(modTags.modId, modIds))
    .orderBy(asc(tags.name));

  for (const row of rows) {
    tagMap.set(row.modId, [...(tagMap.get(row.modId) ?? []), row.name]);
  }

  return tagMap;
}

async function getItemTags(itemIds: number[]) {
  const tagMap = new Map<number, string[]>();
  if (itemIds.length === 0) return tagMap;

  const rows = await getDb()
    .select({ itemId: itemTags.itemId, name: tags.name })
    .from(itemTags)
    .innerJoin(tags, eq(itemTags.tagId, tags.id))
    .where(inArray(itemTags.itemId, itemIds))
    .orderBy(asc(tags.name));

  for (const row of rows) {
    tagMap.set(row.itemId, [...(tagMap.get(row.itemId) ?? []), row.name]);
  }

  return tagMap;
}

export async function getPublishedMods(): Promise<PublicModCard[]> {
  const rows = await getDb()
    .select({
      id: mods.id,
      slug: mods.slug,
      title: mods.title,
      shortDescription: mods.shortDescription,
      category: mods.category,
      coverImage: mods.coverImage,
      featured: mods.featured,
      itemCount: count(items.id),
    })
    .from(mods)
    .leftJoin(
      items,
      and(eq(items.modId, mods.id), eq(items.status, "published")),
    )
    .where(eq(mods.status, "published"))
    .groupBy(mods.id)
    .orderBy(asc(mods.sortOrder), asc(mods.title));

  const tagMap = await getModTags(rows.map((row) => row.id));
  return rows.map((row) => ({ ...row, tags: tagMap.get(row.id) ?? [] }));
}

export async function getFeaturedMods(limit = 3) {
  const allMods = await getPublishedMods();
  return allMods
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

export async function getPublishedItems(): Promise<PublicItemCard[]> {
  const rows = await getDb()
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      summary: items.summary,
      image: items.image,
      durability: items.durability,
      modTitle: mods.title,
      modSlug: mods.slug,
    })
    .from(items)
    .innerJoin(mods, eq(items.modId, mods.id))
    .where(and(eq(items.status, "published"), eq(mods.status, "published")))
    .orderBy(asc(mods.sortOrder), asc(items.sortOrder), asc(items.name));

  const tagMap = await getItemTags(rows.map((row) => row.id));
  return rows.map((row) => ({ ...row, tags: tagMap.get(row.id) ?? [] }));
}

export async function getPublishedModBySlug(slug: string) {
  const [mod] = await getDb()
    .select()
    .from(mods)
    .where(and(eq(mods.slug, slug), eq(mods.status, "published")))
    .limit(1);

  if (!mod) return null;

  const relatedItems = await getDb()
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      summary: items.summary,
      image: items.image,
      durability: items.durability,
    })
    .from(items)
    .where(and(eq(items.modId, mod.id), eq(items.status, "published")))
    .orderBy(asc(items.sortOrder), asc(items.name));

  const [tagMap, itemTagMap, recipeRows] = await Promise.all([
    getModTags([mod.id]),
    getItemTags(relatedItems.map((item) => item.id)),
    getDb()
      .select({
        id: craftingRecipes.id,
        title: craftingRecipes.title,
        station: craftingRecipes.station,
        outputName: craftingRecipes.outputName,
        outputQuantity: craftingRecipes.outputQuantity,
        itemSlug: items.slug,
      })
      .from(craftingRecipes)
      .innerJoin(items, eq(craftingRecipes.itemId, items.id))
      .where(
        and(
          eq(items.modId, mod.id),
          eq(items.status, "published"),
          eq(craftingRecipes.status, "published"),
        ),
      )
      .orderBy(asc(items.sortOrder), asc(craftingRecipes.title)),
  ]);

  return {
    ...mod,
    gallery: safeJsonParse<string[]>(mod.gallery, []),
    tags: tagMap.get(mod.id) ?? [],
    items: relatedItems.map((item) => ({ ...item, tags: itemTagMap.get(item.id) ?? [] })),
    recipes: recipeRows,
  };
}

export async function getPublishedItemBySlug(slug: string) {
  const [row] = await getDb()
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      // obtainMethod: items.obtainMethod,
      summary: items.summary,
      description: items.description,
      functionDescription: items.functionDescription,
      requirements: items.requirements,
      durability: items.durability,
      stats: items.stats,
      howToObtain: items.howToObtain,
      uses: items.uses,
      tips: items.tips,
      image: items.image,
      gallery: items.gallery,
      modId: mods.id,
      modTitle: mods.title,
      modSlug: mods.slug,
      modCategory: mods.category,
    })
    .from(items)
    .innerJoin(mods, eq(items.modId, mods.id))
    .where(
      and(
        eq(items.slug, slug),
        eq(items.status, "published"),
        eq(mods.status, "published"),
      ),
    )
    .limit(1);

  if (!row) return null;

  const relationRows = await getDb()
    .select({ relatedId: itemRelations.relatedItemId })
    .from(itemRelations)
    .where(eq(itemRelations.itemId, row.id));
  const relatedIds = relationRows.map((relation) => relation.relatedId);

  const [recipes, tagMap, relatedItems] = await Promise.all([
    getDb()
      .select()
      .from(craftingRecipes)
      .where(
        and(
          eq(craftingRecipes.itemId, row.id),
          eq(craftingRecipes.status, "published"),
        ),
      )
      .orderBy(asc(craftingRecipes.title)),
    getItemTags([row.id]),
    relatedIds.length
      ? getDb()
          .select({
            id: items.id,
            slug: items.slug,
            name: items.name,
            summary: items.summary,
            image: items.image,
          })
          .from(items)
          .where(
            and(inArray(items.id, relatedIds), eq(items.status, "published")),
          )
          .orderBy(asc(items.name))
      : Promise.resolve([]),
  ]);

  return {
    ...row,
    stats: safeJsonParse<Record<string, string>>(row.stats, {}),
    gallery: safeJsonParse<string[]>(row.gallery, []),
    tags: tagMap.get(row.id) ?? [],
    recipes: recipes.map((recipe) => ({
      ...recipe,
      inputs: safeJsonParse<RecipeInput[]>(recipe.inputs, []),
    })),
    relatedItems,
  };
}

export async function getPublishedFaq() {
  return getDb()
    .select()
    .from(faqEntries)
    .where(eq(faqEntries.status, "published"))
    .orderBy(asc(faqEntries.sortOrder), asc(faqEntries.question));
}

export async function getPublishedInstallationSections() {
  const rows = await getDb()
    .select()
    .from(installationSections)
    .where(eq(installationSections.status, "published"))
    .orderBy(asc(installationSections.sortOrder), asc(installationSections.title));

  return rows.map((row) => ({
    ...row,
    steps: safeJsonParse<string[]>(row.steps, []),
  }));
}

export async function getRecentlyUpdatedItems(limit = 4) {
  const rows = await getDb()
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      summary: items.summary,
      image: items.image,
      durability: items.durability,
      modTitle: mods.title,
      modSlug: mods.slug,
    })
    .from(items)
    .innerJoin(mods, eq(items.modId, mods.id))
    .where(and(eq(items.status, "published"), eq(mods.status, "published")))
    .orderBy(desc(items.updatedAt))
    .limit(limit);

  const tagMap = await getItemTags(rows.map((row) => row.id));
  return rows.map((row) => ({ ...row, tags: tagMap.get(row.id) ?? [] }));
}

export async function getPublicContentCounts() {
  const [[modCount], [itemCount], [recipeCount]] = await Promise.all([
    getDb().select({ value: count() }).from(mods).where(eq(mods.status, "published")),
    getDb().select({ value: count() }).from(items).where(eq(items.status, "published")),
    getDb()
      .select({ value: count() })
      .from(craftingRecipes)
      .where(eq(craftingRecipes.status, "published")),
  ]);

  return {
    mods: modCount.value,
    items: itemCount.value,
    recipes: recipeCount.value,
  };
}

export type SearchEntry = {
  id: string;
  kind: "mod" | "item";
  title: string;
  subtitle: string;
  description: string;
  href: string;
  category: string;
  tags: string[];
  searchText: string;
};

export async function getSearchEntries(): Promise<SearchEntry[]> {
  const [modRows, itemRows] = await Promise.all([
    getDb()
      .select({
        id: mods.id,
        slug: mods.slug,
        title: mods.title,
        shortDescription: mods.shortDescription,
        fullDescription: mods.fullDescription,
        serverPurpose: mods.serverPurpose,
        mechanics: mods.mechanics,
        progression: mods.progression,
        category: mods.category,
      })
      .from(mods)
      .where(eq(mods.status, "published")),
    getDb()
      .select({
        id: items.id,
        slug: items.slug,
        name: items.name,
        summary: items.summary,
        description: items.description,
        functionDescription: items.functionDescription,
        howToObtain: items.howToObtain,
        uses: items.uses,
        tips: items.tips,
        modTitle: mods.title,
        modCategory: mods.category,
      })
      .from(items)
      .innerJoin(mods, eq(items.modId, mods.id))
      .where(and(eq(items.status, "published"), eq(mods.status, "published"))),
  ]);

  const [modTagMap, itemTagMap] = await Promise.all([
    getModTags(modRows.map((row) => row.id)),
    getItemTags(itemRows.map((row) => row.id)),
  ]);

  return [
    ...modRows.map((row): SearchEntry => {
      const entryTags = modTagMap.get(row.id) ?? [];
      return {
        id: `mod-${row.id}`,
        kind: "mod",
        title: row.title,
        subtitle: "Mod",
        description: row.shortDescription,
        href: `/mods/${row.slug}`,
        category: row.category,
        tags: entryTags,
        searchText: [
          row.title,
          row.shortDescription,
          row.fullDescription,
          row.serverPurpose,
          row.mechanics,
          row.progression,
          row.category,
          ...entryTags,
        ].join(" "),
      };
    }),
    ...itemRows.map((row): SearchEntry => {
      const entryTags = itemTagMap.get(row.id) ?? [];
      return {
        id: `item-${row.id}`,
        kind: "item",
        title: row.name,
        subtitle: row.modTitle,
        description: row.summary,
        href: `/items/${row.slug}`,
        category: row.modCategory,
        tags: entryTags,
        searchText: [
          row.name,
          row.modTitle,
          row.summary,
          row.description,
          row.functionDescription,
          row.howToObtain,
          row.uses,
          row.tips,
          ...entryTags,
        ].join(" "),
      };
    }),
  ];
}
