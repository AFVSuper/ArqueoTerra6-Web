import "server-only";

import { and, asc, count, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import {
  craftingRecipes,
  faqEntries,
  installationSections,
  itemRelations,
  items,
  itemTags,
  mediaAssets,
  mods,
  modTags,
  roles,
  tags,
  users,
} from "@/lib/db/schema";

export async function getAdminDashboardData() {
  await requireUser();
  const db = getDb();
  const [modCounts, itemCounts, recipeCounts, recentMods] = await Promise.all([
    db.select({ status: mods.status, value: count() }).from(mods).groupBy(mods.status),
    db.select({ status: items.status, value: count() }).from(items).groupBy(items.status),
    db
      .select({ status: craftingRecipes.status, value: count() })
      .from(craftingRecipes)
      .groupBy(craftingRecipes.status),
    db
      .select({
        id: mods.id,
        title: mods.title,
        status: mods.status,
        updatedAt: mods.updatedAt,
      })
      .from(mods)
      .orderBy(desc(mods.updatedAt))
      .limit(5),
  ]);

  const summarize = (rows: { status: "draft" | "published"; value: number }[]) => ({
    total: rows.reduce((sum, row) => sum + row.value, 0),
    draft: rows.find((row) => row.status === "draft")?.value ?? 0,
    published: rows.find((row) => row.status === "published")?.value ?? 0,
  });

  return {
    mods: summarize(modCounts),
    items: summarize(itemCounts),
    recipes: summarize(recipeCounts),
    recentMods,
  };
}

export async function getAdminMods() {
  await requireUser();
  return getDb()
    .select({
      id: mods.id,
      slug: mods.slug,
      title: mods.title,
      category: mods.category,
      status: mods.status,
      updatedAt: mods.updatedAt,
      itemCount: count(items.id),
    })
    .from(mods)
    .leftJoin(items, eq(items.modId, mods.id))
    .groupBy(mods.id)
    .orderBy(asc(mods.sortOrder), asc(mods.title));
}

export async function getAdminMod(id: number) {
  await requireUser();
  const [mod] = await getDb().select().from(mods).where(eq(mods.id, id)).limit(1);
  if (!mod) return null;

  const tagRows = await getDb()
    .select({ name: tags.name })
    .from(modTags)
    .innerJoin(tags, eq(modTags.tagId, tags.id))
    .where(eq(modTags.modId, id))
    .orderBy(asc(tags.name));

  return { ...mod, tags: tagRows.map((tag) => tag.name) };
}

export async function getAdminItems() {
  await requireUser();
  return getDb()
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      status: items.status,
      durability: items.durability,
      updatedAt: items.updatedAt,
      modId: mods.id,
      modTitle: mods.title,
    })
    .from(items)
    .innerJoin(mods, eq(items.modId, mods.id))
    .orderBy(asc(mods.title), asc(items.sortOrder), asc(items.name));
}

export async function getAdminItem(id: number) {
  await requireUser();
  const [item] = await getDb().select().from(items).where(eq(items.id, id)).limit(1);
  if (!item) return null;
  const [tagRows, relationRows] = await Promise.all([
    getDb()
      .select({ name: tags.name })
      .from(itemTags)
      .innerJoin(tags, eq(itemTags.tagId, tags.id))
      .where(eq(itemTags.itemId, id))
      .orderBy(asc(tags.name)),
    getDb()
      .select({ id: itemRelations.relatedItemId })
      .from(itemRelations)
      .where(eq(itemRelations.itemId, id)),
  ]);
  return {
    ...item,
    tags: tagRows.map((tag) => tag.name),
    relatedItemIds: relationRows.map((relation) => relation.id),
  };
}

export async function getModOptions() {
  await requireUser();
  return getDb()
    .select({ id: mods.id, title: mods.title })
    .from(mods)
    .orderBy(asc(mods.title));
}

export async function getItemOptions() {
  await requireUser();
  return getDb()
    .select({ id: items.id, name: items.name, modTitle: mods.title })
    .from(items)
    .innerJoin(mods, eq(items.modId, mods.id))
    .orderBy(asc(mods.title), asc(items.name));
}

export async function getAdminRecipes() {
  await requireUser();
  return getDb()
    .select({
      id: craftingRecipes.id,
      title: craftingRecipes.title,
      station: craftingRecipes.station,
      outputName: craftingRecipes.outputName,
      status: craftingRecipes.status,
      updatedAt: craftingRecipes.updatedAt,
      itemName: items.name,
      modTitle: mods.title,
    })
    .from(craftingRecipes)
    .innerJoin(items, eq(craftingRecipes.itemId, items.id))
    .innerJoin(mods, eq(items.modId, mods.id))
    .orderBy(asc(mods.title), asc(items.name), asc(craftingRecipes.title));
}

export async function getAdminRecipe(id: number) {
  await requireUser();
  const [recipe] = await getDb()
    .select()
    .from(craftingRecipes)
    .where(eq(craftingRecipes.id, id))
    .limit(1);
  return recipe ?? null;
}

export async function getAdminFaq() {
  await requireUser();
  return getDb()
    .select()
    .from(faqEntries)
    .orderBy(asc(faqEntries.sortOrder), asc(faqEntries.question));
}

export async function getAdminInstallation() {
  await requireUser();
  return getDb()
    .select()
    .from(installationSections)
    .orderBy(asc(installationSections.sortOrder), asc(installationSections.title));
}

export async function getAdminMedia() {
  await requireUser();
  return getDb()
    .select({
      id: mediaAssets.id,
      title: mediaAssets.title,
      url: mediaAssets.url,
      altText: mediaAssets.altText,
      sourceType: mediaAssets.sourceType,
      mimeType: mediaAssets.mimeType,
      createdAt: mediaAssets.createdAt,
      createdBy: users.name,
    })
    .from(mediaAssets)
    .leftJoin(users, eq(mediaAssets.createdById, users.id))
    .orderBy(desc(mediaAssets.createdAt));
}

export async function getMediaOptions() {
  await requireUser();
  return getDb()
    .select({ title: mediaAssets.title, url: mediaAssets.url })
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt));
}

export async function getAdminUsers() {
  const currentUser = await requireUser();
  if (currentUser.role !== "SUPERADMIN") return [];

  return getDb()
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      role: roles.code,
      roleName: roles.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .orderBy(asc(users.name));
}

export async function getRoleOptions() {
  const currentUser = await requireUser();
  if (currentUser.role !== "SUPERADMIN") return [];
  return getDb().select().from(roles).orderBy(asc(roles.id));
}

export async function usernameExists(username: string) {
  const [row] = await getDb()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return Boolean(row);
}

export async function contentSlugExists(
  type: "mod" | "item",
  slug: string,
  ignoredId?: number,
) {
  const table = type === "mod" ? mods : items;
  const filters = ignoredId
    ? and(eq(table.slug, slug), eq(table.id, ignoredId))
    : eq(table.slug, slug);
  const [row] = await getDb().select({ id: table.id }).from(table).where(filters).limit(1);
  return Boolean(row && row.id !== ignoredId);
}
