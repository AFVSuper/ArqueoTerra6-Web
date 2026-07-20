"use server";

import { hash } from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { getStore } from "@netlify/blobs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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
  type ContentStatus,
  type RoleCode,
} from "@/lib/db/schema";
import {
  canDeleteContent,
  canEditContent,
  canManageUsers,
  canPublishContent,
} from "@/lib/permissions";
import {
  linesToList,
  recipeInputsFromText,
  slugify,
  statsToRecord,
} from "@/lib/utils";

const statusSchema = z.enum(["draft", "published"]);

const modSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().min(10),
  fullDescription: z.string().trim().min(20),
  serverPurpose: z.string().trim(),
  mechanics: z.string().trim(),
  progression: z.string().trim(),
  practicalNotes: z.string().trim(),
  category: z.string().trim().min(2),
  coverImage: z.string().trim().optional(),
  status: statusSchema,
  sortOrder: z.coerce.number().int(),
});

const itemSchema = z.object({
  modId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  summary: z.string().trim().min(10),
  description: z.string().trim().min(20),
  functionDescription: z.string().trim(),
  requirements: z.string().trim(),
  howToObtain: z.string().trim(),
  uses: z.string().trim(),
  tips: z.string().trim(),
  image: z.string().trim().optional(),
  status: statusSchema,
  sortOrder: z.coerce.number().int(),
});

const recipeSchema = z.object({
  itemId: z.coerce.number().int().positive(),
  title: z.string().trim().min(2),
  station: z.string().trim().min(2),
  outputName: z.string().trim().min(2),
  outputQuantity: z.coerce.number().int().positive(),
  notes: z.string().trim(),
  image: z.string().trim().optional(),
  status: statusSchema,
});

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function requestedStatus(formData: FormData) {
  return statusSchema.catch("draft").parse(formData.get("status"));
}

function allowedStatus(role: RoleCode, status: ContentStatus): ContentStatus {
  return status === "published" && !canPublishContent(role) ? "draft" : status;
}

async function authorizeEdit() {
  const user = await requireUser();
  if (!canEditContent(user.role)) throw new Error("No tienes permiso para editar contenido.");
  return user;
}

async function authorizeDelete() {
  const user = await requireUser();
  if (!canDeleteContent(user.role)) throw new Error("No tienes permiso para eliminar contenido.");
  return user;
}

async function uniqueSlug(type: "mod" | "item", value: string, ignoredId?: number) {
  const table = type === "mod" ? mods : items;
  const base = slugify(value) || type;
  let candidate = base;
  let suffix = 2;

  while (true) {
    const conditions = ignoredId
      ? and(eq(table.slug, candidate), ne(table.id, ignoredId))
      : eq(table.slug, candidate);
    const [existing] = await getDb()
      .select({ id: table.id })
      .from(table)
      .where(conditions)
      .limit(1);
    if (!existing) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

function parseTagNames(value: FormDataEntryValue | null) {
  return [...new Set(String(value ?? "").split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean))];
}

async function ensureTagIds(names: string[]) {
  const ids: number[] = [];
  for (const name of names) {
    const tagSlug = slugify(name);
    await getDb().insert(tags).values({ name, slug: tagSlug }).onConflictDoNothing();
    const [tag] = await getDb()
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.slug, tagSlug))
      .limit(1);
    ids.push(tag.id);
  }
  return ids;
}

async function syncModTags(modId: number, names: string[]) {
  await getDb().delete(modTags).where(eq(modTags.modId, modId));
  const tagIds = await ensureTagIds(names);
  if (tagIds.length) {
    await getDb().insert(modTags).values(tagIds.map((tagId) => ({ modId, tagId })));
  }
}

async function syncItemTags(itemId: number, names: string[]) {
  await getDb().delete(itemTags).where(eq(itemTags.itemId, itemId));
  const tagIds = await ensureTagIds(names);
  if (tagIds.length) {
    await getDb().insert(itemTags).values(tagIds.map((tagId) => ({ itemId, tagId })));
  }
}

async function syncItemRelations(itemId: number, relatedIds: number[]) {
  await getDb().delete(itemRelations).where(eq(itemRelations.itemId, itemId));
  const uniqueIds = [...new Set(relatedIds)].filter((id) => id !== itemId);
  if (uniqueIds.length) {
    await getDb()
      .insert(itemRelations)
      .values(uniqueIds.map((relatedItemId) => ({ itemId, relatedItemId })));
  }
}

function refreshPublicContent() {
  revalidatePath("/");
  revalidatePath("/mods");
  revalidatePath("/buscar");
  revalidatePath("/faq");
  revalidatePath("/instalacion");
  revalidatePath("/admin", "layout");
}

export async function saveModAction(id: number | null, formData: FormData) {
  const user = await authorizeEdit();
  const parsed = modSchema.safeParse({
    title: formValue(formData, "title"),
    slug: formValue(formData, "slug"),
    shortDescription: formValue(formData, "shortDescription"),
    fullDescription: formValue(formData, "fullDescription"),
    serverPurpose: formValue(formData, "serverPurpose"),
    mechanics: formValue(formData, "mechanics"),
    progression: formValue(formData, "progression"),
    practicalNotes: formValue(formData, "practicalNotes"),
    category: formValue(formData, "category"),
    coverImage: formValue(formData, "coverImage"),
    status: requestedStatus(formData),
    sortOrder: formValue(formData, "sortOrder") || "0",
  });
  if (!parsed.success) throw new Error("Faltan campos obligatorios en el mod.");

  const slug = await uniqueSlug("mod", parsed.data.slug || parsed.data.title, id ?? undefined);
  const values = {
    ...parsed.data,
    slug,
    coverImage: parsed.data.coverImage || null,
    gallery: JSON.stringify(linesToList(formData.get("gallery"))),
    featured: formData.get("featured") === "on",
    status: allowedStatus(user.role, parsed.data.status),
    updatedAt: new Date(),
  };

  let savedId = id;
  if (id) {
    await getDb().update(mods).set(values).where(eq(mods.id, id));
  } else {
    const [created] = await getDb().insert(mods).values(values).returning({ id: mods.id });
    savedId = created.id;
  }

  await syncModTags(savedId!, parseTagNames(formData.get("tags")));
  refreshPublicContent();
  redirect(`/admin/mods/${savedId}?saved=1`);
}

export async function deleteModAction(id: number) {
  await authorizeDelete();
  await getDb().delete(mods).where(eq(mods.id, id));
  refreshPublicContent();
  redirect("/admin/mods?deleted=1");
}

export async function saveItemAction(id: number | null, formData: FormData) {
  const user = await authorizeEdit();
  const parsed = itemSchema.safeParse({
    modId: formValue(formData, "modId"),
    name: formValue(formData, "name"),
    slug: formValue(formData, "slug"),
    summary: formValue(formData, "summary"),
    description: formValue(formData, "description"),
    functionDescription: formValue(formData, "functionDescription"),
    requirements: formValue(formData, "requirements"),
    howToObtain: formValue(formData, "howToObtain"),
    uses: formValue(formData, "uses"),
    tips: formValue(formData, "tips"),
    image: formValue(formData, "image"),
    status: requestedStatus(formData),
    sortOrder: formValue(formData, "sortOrder") || "0",
  });
  if (!parsed.success) throw new Error("Faltan campos obligatorios en el objeto.");

  const durabilityValue = formValue(formData, "durability").trim();
  const slug = await uniqueSlug("item", parsed.data.slug || parsed.data.name, id ?? undefined);
  const values = {
    ...parsed.data,
    slug,
    image: parsed.data.image || null,
    durability: durabilityValue ? Math.max(0, Number(durabilityValue) || 0) : null,
    stats: JSON.stringify(statsToRecord(formData.get("stats"))),
    gallery: JSON.stringify(linesToList(formData.get("gallery"))),
    status: allowedStatus(user.role, parsed.data.status),
    updatedAt: new Date(),
  };

  let savedId = id;
  if (id) {
    await getDb().update(items).set(values).where(eq(items.id, id));
  } else {
    const [created] = await getDb().insert(items).values(values).returning({ id: items.id });
    savedId = created.id;
  }

  await Promise.all([
    syncItemTags(savedId!, parseTagNames(formData.get("tags"))),
    syncItemRelations(
      savedId!,
      formData.getAll("relatedItemIds").map((value) => Number(value)).filter(Boolean),
    ),
  ]);
  refreshPublicContent();
  redirect(`/admin/items/${savedId}?saved=1`);
}

export async function deleteItemAction(id: number) {
  await authorizeDelete();
  await getDb().delete(items).where(eq(items.id, id));
  refreshPublicContent();
  redirect("/admin/items?deleted=1");
}

export async function saveRecipeAction(id: number | null, formData: FormData) {
  const user = await authorizeEdit();
  const parsed = recipeSchema.safeParse({
    itemId: formValue(formData, "itemId"),
    title: formValue(formData, "title"),
    station: formValue(formData, "station"),
    outputName: formValue(formData, "outputName"),
    outputQuantity: formValue(formData, "outputQuantity") || "1",
    notes: formValue(formData, "notes"),
    image: formValue(formData, "image"),
    status: requestedStatus(formData),
  });
  if (!parsed.success) throw new Error("Revisa los campos de la receta.");

  const values = {
    ...parsed.data,
    image: parsed.data.image || null,
    inputs: JSON.stringify(recipeInputsFromText(formData.get("inputs"))),
    status: allowedStatus(user.role, parsed.data.status),
    updatedAt: new Date(),
  };

  let savedId = id;
  if (id) {
    await getDb().update(craftingRecipes).set(values).where(eq(craftingRecipes.id, id));
  } else {
    const [created] = await getDb()
      .insert(craftingRecipes)
      .values(values)
      .returning({ id: craftingRecipes.id });
    savedId = created.id;
  }

  refreshPublicContent();
  redirect(`/admin/recetas/${savedId}?saved=1`);
}

export async function deleteRecipeAction(id: number) {
  await authorizeDelete();
  await getDb().delete(craftingRecipes).where(eq(craftingRecipes.id, id));
  refreshPublicContent();
  redirect("/admin/recetas?deleted=1");
}

export async function saveFaqAction(id: number | null, formData: FormData) {
  const user = await authorizeEdit();
  const question = formValue(formData, "question").trim();
  const answer = formValue(formData, "answer").trim();
  const category = formValue(formData, "category").trim();
  if (question.length < 5 || answer.length < 10 || !category) {
    throw new Error("Completa pregunta, respuesta y categoría.");
  }
  const values = {
    question,
    answer,
    category,
    status: allowedStatus(user.role, requestedStatus(formData)),
    sortOrder: Number(formValue(formData, "sortOrder")) || 0,
    updatedAt: new Date(),
  };
  if (id) await getDb().update(faqEntries).set(values).where(eq(faqEntries.id, id));
  else await getDb().insert(faqEntries).values(values);
  refreshPublicContent();
  redirect("/admin/faq?saved=1");
}

export async function deleteFaqAction(id: number) {
  await authorizeDelete();
  await getDb().delete(faqEntries).where(eq(faqEntries.id, id));
  refreshPublicContent();
  redirect("/admin/faq?deleted=1");
}

export async function saveInstallationAction(id: number | null, formData: FormData) {
  const user = await authorizeEdit();
  const title = formValue(formData, "title").trim();
  if (title.length < 2) throw new Error("El título es obligatorio.");
  const values = {
    title,
    intro: formValue(formData, "intro").trim(),
    body: formValue(formData, "body").trim(),
    steps: JSON.stringify(linesToList(formData.get("steps"))),
    icon: formValue(formData, "icon") || "compass",
    status: allowedStatus(user.role, requestedStatus(formData)),
    sortOrder: Number(formValue(formData, "sortOrder")) || 0,
    updatedAt: new Date(),
  };
  if (id) {
    await getDb()
      .update(installationSections)
      .set(values)
      .where(eq(installationSections.id, id));
  } else {
    await getDb().insert(installationSections).values(values);
  }
  refreshPublicContent();
  redirect("/admin/instalacion?saved=1");
}

export async function deleteInstallationAction(id: number) {
  await authorizeDelete();
  await getDb().delete(installationSections).where(eq(installationSections.id, id));
  refreshPublicContent();
  redirect("/admin/instalacion?deleted=1");
}

export async function addExternalMediaAction(formData: FormData) {
  const user = await authorizeEdit();
  const title = formValue(formData, "title").trim();
  const url = formValue(formData, "url").trim();
  const altText = formValue(formData, "altText").trim();
  if (!title || !url || !altText) throw new Error("Completa título, URL y texto alternativo.");

  await getDb()
    .insert(mediaAssets)
    .values({ title, url, altText, sourceType: "external", createdById: user.id })
    .onConflictDoUpdate({ target: mediaAssets.url, set: { title, altText } });
  revalidatePath("/admin/medios");
  redirect("/admin/medios?saved=1");
}

export async function deleteMediaAction(id: number) {
  await authorizeDelete();
  const [asset] = await getDb()
    .select({ url: mediaAssets.url, sourceType: mediaAssets.sourceType })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  if (asset?.sourceType === "upload" && asset.url.startsWith("/api/media/")) {
    await getStore("arqueoterra-media", { consistency: "strong" })
      .delete(decodeURIComponent(asset.url.slice("/api/media/".length)))
      .catch(() => undefined);
  }

  await getDb().delete(mediaAssets).where(eq(mediaAssets.id, id));
  revalidatePath("/admin/medios");
  redirect("/admin/medios?deleted=1");
}

export async function createStaffUserAction(formData: FormData) {
  const currentUser = await requireUser();
  if (!canManageUsers(currentUser.role)) throw new Error("No tienes permiso para gestionar usuarios.");

  const name = formValue(formData, "name").trim();
  const username = formValue(formData, "username").trim().toLowerCase();
  const password = formValue(formData, "password");
  const roleCode = z.enum(["SUPERADMIN", "EDITOR", "REVIEWER"]).parse(formData.get("role"));
  if (name.length < 2 || username.length < 2 || password.length < 10) {
    throw new Error("El usuario necesita nombre, alias y una contraseña de 10 caracteres.");
  }

  const [role] = await getDb().select({ id: roles.id }).from(roles).where(eq(roles.code, roleCode)).limit(1);
  await getDb().insert(users).values({
    name,
    username,
    passwordHash: await hash(password, 12),
    roleId: role.id,
  });
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?saved=1");
}

export async function deleteStaffUserAction(id: number) {
  const currentUser = await requireUser();
  if (!canManageUsers(currentUser.role)) throw new Error("No tienes permiso para gestionar usuarios.");
  if (currentUser.id === id) throw new Error("No puedes eliminar tu propia cuenta activa.");
  await getDb().delete(users).where(eq(users.id, id));
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?deleted=1");
}
